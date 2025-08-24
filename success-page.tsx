"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface SuccessPageProps {
  userName: string
}

export default function SuccessPage({ userName }: SuccessPageProps) {
  const [timeLeft, setTimeLeft] = useState(5526) // Bắt đầu từ 1 tiếng 32 phút 6 giây (1*3600 + 32*60 + 6 = 5526 giây)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope)
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setTimeLeft((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    // --- BẮT ĐẦU KHU VỰC CÓ THỂ CHỈNH SỬA ĐỊNH DẠNG THỜI GIAN ---
    // Hiển thị thời gian theo định dạng giờ:phút:giây với 2 chữ số cho mỗi phần (01:32:06)
    // Thay đổi padStart cho hours từ không có thành có để hiển thị 2 chữ số
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    // --- KẾT THÚC KHU VỰC CÓ THỂ CHỈNH SỬA ĐỊNH DẠNG THỜI GIAN ---
  }

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return (
    <div
      className="text-white relative overflow-hidden"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // --- BẮT ĐẦU KHU VỰC CÓ THỂ CHỈNH SỬA KÍCH THƯỚC MÀN HÌNH ---
        // Điều chỉnh kích thước cho iPhone 15 (393px x 852px)
        maxWidth: "393px",
        minHeight: "852px",
        // --- KẾT THÚC KHU VỰC CÓ THỂ CHỈNH SỬA KÍCH THƯỚC MÀN HÌNH ---
        margin: "0 auto",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full px-4">
        <div className="text-center pb-3.5 pt-3.5">
          <h1 className="text-lg font-medium text-[#E0E0C0]">{userName}</h1>
        </div>
        {/* QR Card - Positioned higher */}
        <div className="flex-none mb-2.5">
          <div
            className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: "url('/card-background.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              paddingTop: "10%",
              paddingBottom: "2%",
            }}
          >
            <div className="absolute top-0 left-0 right-0 px-5 text-center py-5">
              <p className="text-white font-medium text-base mt-[2px] border-0 tracking-widest">
                将二维码对准扫描器刷码出场
              </p>
            </div>

            <div className="px-6 text-center text-black pb-0 pt-0 leading-3 pl-6 mx-0">
              <div className="font-mono text-black border-0 px-0 tracking-normal mt-14 mb-px text-base">
                {formatDateTime(currentTime)}
              </div>
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-lg flex items-center justify-center p-2 flex-row w-full h-full py-0 px-0">
                  <img src="/qr-code.png" alt="QR Code" className="w-full h-full object-contain" />
                </div>
              </div>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800 p-0 h-auto font-normal mb-1.5">
                刷新二维码
              </Button>
              <div className="space-y-2 leading-7">
                <div className="text-green-500 font-normal text-lg blink-text leading-3">已生效</div>
                <div className="text-green-500 font-mono font-normal text-lg">{formatTime(timeLeft)}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Text - Positioned at bottom */}
        <div className="flex-1 flex items-end pb-8">
          <div className="w-full px-4 text-center">
            <p className="text-[#E0E0C0] text-sm leading-relaxed">
              尊敬的员工您好，您已进入企业涉密区域，出于企业安全考虑，您的手机摄像头将被禁止拍摄，感谢您的配合。
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 30% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .blink-text {
          animation: blink 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
