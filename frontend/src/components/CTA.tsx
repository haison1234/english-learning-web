interface CTAProps {
  onRegisterClick: () => void
}

export default function CTA({ onRegisterClick }: CTAProps) {
  return (
    <section id="contact" className="w-full bg-deepNavy py-16 md:py-20 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-actionBlue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 text-center flex flex-col items-center">
        <span className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
          Sẵn sàng bứt phá?
        </span>
        <h2 className="font-poppins text-white text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl leading-tight">
          Bắt Đầu Hành Trình Chinh Phục Tiếng Anh Ngay Hôm Nay
        </h2>
        <p className="text-white/70 text-sm mt-4 max-w-xl leading-relaxed">
          Tham gia cùng hơn 50.000+ học viên đang bứt phá điểm số và phát âm chuẩn Mỹ mỗi ngày trên phòng luyện thi ảo.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-actionBlue hover:bg-offWhite1 active:scale-95 font-semibold text-sm rounded-[999px] shadow-l2 transition-all duration-200"
          >
            Đăng ký học thử miễn phí
          </button>
          
          <a
            href="#courses"
            className="w-full sm:w-auto px-8 py-3.5 border border-white/20 text-white hover:bg-white/10 active:scale-95 font-semibold text-sm rounded-[999px] transition-all duration-200"
          >
            Khám phá lộ trình học
          </a>
        </div>
      </div>
    </section>
  )
}
