import { Sparkles, Compass, CheckCircle2, BarChart3 } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: Compass,
      title: 'Phòng Luyện Thi Ảo (Virtual Room)',
      desc: 'Môi trường thực hành Speaking & Writing đột phá. Đánh giá ngay lập tức, sửa đổi cách phát âm từng chữ và gợi ý cấu trúc ngữ pháp nâng cao.',
    },
    {
      icon: CheckCircle2,
      title: 'Lộ Trình Học Cá Nhân Hóa',
      desc: 'Giáo trình được chia tách tinh gọn theo cấp độ từ Beginner đến Advanced. Giúp bạn tập trung cải thiện đúng những kỹ năng còn yếu.',
    },
    {
      icon: Sparkles,
      title: 'Bài Tập Tương Tác Đa Dạng',
      desc: 'Không chỉ học lý thuyết, bạn được rèn luyện thực hành qua trắc nghiệm, điền khuyết và ghép cặp thông minh để nhớ bài sâu sắc ngay tại lớp.',
    },
    {
      icon: BarChart3,
      title: 'Theo Dõi Tiến Độ Trực Quan',
      desc: 'Dashboard báo cáo chi tiết thời lượng học, chuỗi streak hàng ngày và tiến trình hoàn thành khóa học để duy trì thói quen học tập kỷ luật.',
    },
  ]

  return (
    <section id="about" className="bg-[#FFFFFF] py-20 border-b border-grayBorder">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-actionBlue font-poppins text-xs font-semibold tracking-widest uppercase bg-actionBlue/5 px-4 py-1.5 rounded-[999px]">
            Lý do chọn English.Learn
          </span>
          <h2 className="font-poppins text-brandDark text-3xl md:text-4xl font-bold tracking-tight mt-4">
            Phương Pháp Học Tiếng Anh Toàn Diện & Tinh Gọn
          </h2>
          <p className="text-secondaryText text-sm mt-3">
            Chúng tôi mang lại giải pháp học tập chuẩn hóa, kết hợp giữa bài giảng chuyên sâu và hệ thống luyện tập ảo phản hồi tức thì.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon
            return (
              <div
                key={index}
                className="bg-white border border-grayBorder rounded-[16px] p-6 shadow-l1 hover:shadow-l2 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-[12px] bg-actionBlue/5 flex items-center justify-center text-actionBlue mb-5 border border-actionBlue/10">
                  <Icon size={24} />
                </div>
                <h3 className="font-poppins text-brandDark text-base font-bold mb-2">
                  {feat.title}
                </h3>
                <p className="text-secondaryText text-xs leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
