const CARDS = [
  {
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    score: '8.7/10',
    title: 'Giao Tiếp Cơ Bản Cho Người Mới',
    level: 'Beginner',
    type: 'FREE',
    price: 'Miễn phí',
  },
  {
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    score: '9.0/10',
    title: 'Phát Âm & Phản Xạ Tiếng Anh Chuẩn Mỹ',
    level: 'Intermediate',
    type: 'PREMIUM',
    price: '399.000đ',
  },
  {
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    score: '9.5/10',
    title: 'Luyện Thi IELTS Chuyên Sâu Cấp Tốc',
    level: 'Advanced',
    type: 'PREMIUM',
    price: '899.000đ',
  },
]

export default function Collection() {
  return (
    <section id="courses" className="w-full bg-[#010828] py-16 sm:py-20 md:py-24">
      <div className="max-w-[1831px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">

        {/* ── HEADER ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 sm:mb-12 md:mb-14">

          {/* Left: Heading */}
          <h2
            className="font-grotesk text-[#EFF4FF] uppercase"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.05 }}
          >
            Hệ thống
            <br />
            <span className="ml-12 sm:ml-24 lg:ml-32">
              <span className="font-condiment text-[#6FFF00]" style={{ fontSize: '1.2em' }}>
                Khóa học{' '}
              </span>
              Nổi bật
            </span>
          </h2>

          {/* Right: SEE ALL button with neon underbar */}
          <button className="group flex flex-col items-start shrink-0">
            <div className="flex items-baseline gap-3">
              <span
                className="font-grotesk text-[#EFF4FF] uppercase group-hover:text-[#6FFF00] transition-colors duration-200"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
              >
                XEM
              </span>
              <div className="flex flex-col leading-tight">
                <span
                  className="font-grotesk text-[#EFF4FF] uppercase group-hover:text-[#6FFF00] transition-colors duration-200"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}
                >
                  TẤT CẢ
                </span>
                <span
                  className="font-grotesk text-[#EFF4FF] uppercase group-hover:text-[#6FFF00] transition-colors duration-200"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}
                >
                  KHÓA HỌC
                </span>
              </div>
            </div>
            {/* Neon underbar */}
            <div
              className="bg-[#6FFF00] w-full mt-2 rounded-full"
              style={{ height: 'clamp(6px, 0.6vw, 10px)' }}
            />
          </button>
        </div>

        {/* ── CARD GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors duration-200 flex flex-col"
            >
              {/* Square video with aspect-ratio trick */}
              <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
                <video
                  src={card.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Course Type Badge */}
                <div
                  className="absolute top-4 left-4 px-3.5 py-1.5 rounded-[12px] font-grotesk text-xs uppercase tracking-wider backdrop-blur-md"
                  style={{
                    backgroundColor: card.type === 'FREE' ? 'rgba(111, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: card.type === 'FREE' ? '#6FFF00' : '#EFF4FF',
                    border: `1px solid ${card.type === 'FREE' ? '#6FFF00' : 'rgba(255, 255, 255, 0.2)'}`
                  }}
                >
                  {card.type}
                </div>
              </div>

              {/* Title & Level */}
              <div className="mt-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#EFF4FF]/40 uppercase tracking-widest">{card.level}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6FFF00]/40" />
                  <span className="font-mono text-xs text-[#EFF4FF]/40 uppercase tracking-widest">{card.score}</span>
                </div>
                <h3 className="font-grotesk text-[#EFF4FF] text-xl uppercase mt-2 leading-snug min-h-[3.6rem] flex items-center">
                  {card.title}
                </h3>
              </div>

              {/* Price / Buy bar */}
              <div className="liquid-glass rounded-[20px] px-5 py-4 mt-4 flex items-center justify-between">
                <div>
                  <p className="font-grotesk text-[#EFF4FF]/50 text-[11px] uppercase">
                    HỌC PHÍ
                  </p>
                  <p className="font-grotesk text-[#EFF4FF] text-[18px] uppercase tracking-wide">
                    {card.price}
                  </p>
                </div>

                {/* Buy button */}
                <button
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 active:scale-95 transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #b724ff, #7c3aed)',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
