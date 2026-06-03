import { useState, useEffect, useRef } from 'react';
import { getCourseDetail, CourseDetailDTO, LessonDTO } from '../services/courseService';

const BACKUP_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4'
];

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onEnroll: () => void;
  isLoggedIn: boolean;
}

export default function CourseDetail({ courseId, onBack, onEnroll, isLoggedIn }: CourseDetailProps) {
  const [course, setCourse] = useState<CourseDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Trình phát video preview
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('Trailer giới thiệu');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function loadCourseDetail() {
      try {
        setLoading(true);
        const data = await getCourseDetail(courseId);
        setCourse(data);
        
        // Cấu hình video preview mặc định (Trailer)
        const defaultVideo = getVideoSrc(data.id, data.trailerUrl);
        setActiveVideoUrl(defaultVideo);
        setActiveVideoTitle('Trailer giới thiệu');
      } catch (err: any) {
        console.error('Lỗi tải chi tiết khóa học:', err);
        setError(err.message || 'Không thể tải chi tiết khóa học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
    loadCourseDetail();
  }, [courseId]);

  // Đồng bộ lại src video khi activeVideoUrl thay đổi
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Tránh lỗi autplay trên một số trình duyệt
      });
    }
  }, [activeVideoUrl]);

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Beginner';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      default: return 'All Levels';
    }
  };

  const getContentTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Video bài giảng';
      case 1: return 'Tài liệu Audio';
      case 2: return 'Bài viết Lý thuyết';
      case 3: return 'Tài liệu PDF';
      default: return 'Bài học';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return 'Tài liệu đọc';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  const getVideoSrc = (id: string, trailerUrl: string | null) => {
    if (trailerUrl && !trailerUrl.includes('cdn.elearning.vn')) {
      return trailerUrl;
    }
    // Lấy video fallback động dựa trên ID của khóa học
    const charCodeSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return BACKUP_VIDEOS[charCodeSum % BACKUP_VIDEOS.length];
  };

  // Tính tổng thời lượng của syllabus
  const getTotalDuration = (lessons: LessonDTO[]) => {
    const totalSec = lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0);
    if (totalSec === 0) return 'Tự do';
    return formatDuration(totalSec);
  };

  const handleLessonPreview = (lesson: LessonDTO, index: number) => {
    if (!lesson.preview) return;
    
    // Tìm video để phát thử
    const lessonVideo = lesson.contentUrl && !lesson.contentUrl.includes('cdn.elearning.vn')
      ? lesson.contentUrl
      : BACKUP_VIDEOS[index % BACKUP_VIDEOS.length];
      
    setActiveVideoUrl(lessonVideo);
    setActiveVideoTitle(lesson.title);
    
    // Cuộn lên trình phát video
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010828] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FFF00]"></div>
          <span className="font-mono text-xs text-[#EFF4FF]/60 uppercase tracking-widest">Đang tải dữ liệu khóa học...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#010828] flex items-center justify-center px-4">
        <div className="liquid-glass max-w-md w-full rounded-[32px] p-8 text-center border border-red-500/20">
          <svg className="w-16 h-16 text-red-500/80 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="font-grotesk text-xl text-[#EFF4FF] uppercase mb-2">Đã xảy ra lỗi</h3>
          <p className="font-mono text-sm text-[#EFF4FF]/60 mb-6">{error || 'Không tìm thấy dữ liệu khóa học.'}</p>
          <button onClick={onBack} className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-sm uppercase font-mono">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const isFree = course.courseType === 0;
  const priceText = isFree ? 'Miễn phí' : `${course.basePrice.toLocaleString('vi-VN')}đ`;

  return (
    <div className="min-h-screen bg-[#010828] py-16 sm:py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
        
        {/* ── NÚT QUAY LẠI ── */}
        <button 
          onClick={onBack} 
          className="group flex items-center gap-2 text-[#EFF4FF]/60 hover:text-[#6FFF00] transition-colors duration-200 uppercase font-mono text-xs tracking-widest mb-8"
        >
          <svg 
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại trang chủ
        </button>

        {/* ── BỐ CỤC CHÍNH (GRID 2 CỘT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* CỘT TRÁI: THÔNG TIN KHÓA HỌC (8 cột) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Badge Cấp độ */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-[8px] bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs uppercase tracking-wider">
                  {getLevelLabel(course.level)}
                </span>
                <span className="px-3 py-1 rounded-[8px] bg-[#6FFF00]/10 border border-[#6FFF00]/30 text-[#6FFF00] font-mono text-xs uppercase tracking-wider">
                  {isFree ? 'Miễn phí' : 'Cao cấp'}
                </span>
              </div>

              {/* Tên khóa học */}
              <h1 className="font-grotesk text-[#EFF4FF] text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mb-6">
                {course.title}
              </h1>

              {/* Mô tả */}
              <p className="text-[#EFF4FF]/85 text-base sm:text-lg font-light leading-relaxed mb-8">
                {course.description}
              </p>

              {/* Grid thông số khóa học */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="liquid-glass rounded-[20px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-[#EFF4FF]/40 uppercase tracking-widest mb-1">Giảng viên</span>
                  <span className="font-mono text-sm font-semibold truncate text-[#EFF4FF]">{course.createdByName}</span>
                </div>
                <div className="liquid-glass rounded-[20px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-[#EFF4FF]/40 uppercase tracking-widest mb-1">Bài học</span>
                  <span className="font-mono text-sm font-semibold text-[#EFF4FF]">{course.lessons.length} bài</span>
                </div>
                <div className="liquid-glass rounded-[20px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-[#EFF4FF]/40 uppercase tracking-widest mb-1">Thời lượng</span>
                  <span className="font-mono text-sm font-semibold text-[#EFF4FF]">{getTotalDuration(course.lessons)}</span>
                </div>
                <div className="liquid-glass rounded-[20px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-[#EFF4FF]/40 uppercase tracking-widest mb-1">Học phí</span>
                  <span className="font-mono text-sm font-semibold text-[#6FFF00]">{priceText}</span>
                </div>
              </div>
            </div>

            {/* Nút Đăng Ký Học */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <button
                onClick={onEnroll}
                className="w-full sm:w-auto px-10 py-5 rounded-[20px] font-grotesk uppercase tracking-wider text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-center"
                style={{
                  background: 'linear-gradient(135deg, #b724ff, #7c3aed)',
                  boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)'
                }}
              >
                {isLoggedIn ? 'Bắt đầu học ngay' : 'Đăng ký học ngay'}
              </button>
              
              {!isLoggedIn && (
                <p className="text-xs text-[#EFF4FF]/40 font-mono italic max-w-xs text-center sm:text-left">
                  * Yêu cầu tài khoản để tham gia học, làm bài tập và nhận chứng chỉ hoàn thành.
                </p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TRÌNH PHÁT VIDEO PREVIEW (5 cột) */}
          <div className="lg:col-span-5">
            <div className="liquid-glass rounded-[32px] p-4 border border-white/5 flex flex-col shadow-2xl">
              
              {/* Tiêu đề xem trước */}
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#EFF4FF]/80">
                  Preview: <span className="text-[#6FFF00] font-semibold">{activeVideoTitle}</span>
                </span>
              </div>
              
              {/* Khung chứa Video */}
              <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-black/60 border border-white/10">
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mô tả ngắn của preview */}
              <p className="text-center font-mono text-[11px] text-[#EFF4FF]/50 mt-4 leading-normal px-2">
                Bất kỳ ai (kể cả khách vãng lai) đều có thể phát thử video giới thiệu này mà không cần đăng nhập.
              </p>
            </div>
          </div>

        </div>

        {/* ── SYLLABUS SECTION (CHƯƠNG TRÌNH HỌC) ── */}
        <div className="mt-16 sm:mt-24">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
            <h2 className="font-grotesk text-[#EFF4FF] text-2xl sm:text-3xl uppercase tracking-wider">
              Chương trình học
            </h2>
            <span className="font-mono text-sm text-[#EFF4FF]/40 uppercase tracking-widest">
              {course.lessons.length} Bài học
            </span>
          </div>

          {/* Danh sách bài học */}
          {course.lessons.length === 0 ? (
            <div className="text-center py-10 text-[#EFF4FF]/30 font-mono">
              Chưa có bài học nào được tải lên cho khóa học này.
            </div>
          ) : (
            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => {
                const isPreviewable = lesson.preview;
                return (
                  <div
                    key={lesson.id}
                    className={`liquid-glass rounded-[24px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                      isPreviewable ? 'hover:bg-white/5 border border-green-500/10' : 'opacity-80'
                    }`}
                  >
                    
                    {/* Phần bên trái: Thứ tự & Tên bài học */}
                    <div className="flex items-start gap-4">
                      {/* Số thứ tự */}
                      <span className="font-grotesk text-2xl text-[#6FFF00]/30 min-w-[2rem]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      
                      {/* Tiêu đề & Loại bài */}
                      <div>
                        <h4 className="font-grotesk text-[#EFF4FF] text-lg uppercase leading-snug">
                          {lesson.title}
                        </h4>
                        
                        <div className="flex items-center gap-2.5 mt-1">
                          <span className="font-mono text-[11px] text-[#EFF4FF]/40 uppercase">
                            {getContentTypeLabel(lesson.contentType)}
                          </span>
                          {lesson.durationSeconds > 0 && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-[#EFF4FF]/20" />
                              <span className="font-mono text-[11px] text-[#EFF4FF]/40">
                                {formatDuration(lesson.durationSeconds)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phần bên phải: Trạng thái & Xem thử */}
                    <div className="flex items-center md:justify-end shrink-0 gap-3">
                      
                      {/* Nhãn Preview */}
                      {isPreviewable ? (
                        <button
                          onClick={() => handleLessonPreview(lesson, idx)}
                          className="px-4 py-2 rounded-full border border-[#6FFF00]/40 text-[#6FFF00] hover:bg-[#6FFF00] hover:text-black transition-all duration-200 font-mono text-xs uppercase font-bold flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Học thử (Preview)
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 font-mono text-xs text-[#EFF4FF]/30 uppercase px-3 py-1.5">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0-2-.9-2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                          </svg>
                          Cần đăng ký
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
