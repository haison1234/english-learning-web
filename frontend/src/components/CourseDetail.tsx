import { useState, useEffect, useRef } from 'react';
import { getCourseDetail, CourseDetailDTO, LessonDTO } from '../services/courseService';
import { ArrowLeft, BookOpen, Clock, Users, Play, Lock, Sparkles, Award } from 'lucide-react';

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
        // Tránh lỗi autoplay trên một số trình duyệt
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

  const getLevelBadgeStyles = (level: number) => {
    switch (level) {
      case 0: return 'bg-blue-50 text-blue-600 border-blue-100';
      case 1: return 'bg-amber-50 text-amber-600 border-amber-100';
      case 2: return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
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
      <div className="min-h-screen bg-offWhite1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-actionBlue"></div>
          <span className="text-xs text-secondaryText uppercase tracking-wider font-semibold">Đang tải dữ liệu khóa học...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-offWhite1 flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-[24px] p-8 text-center border border-grayBorder shadow-l3">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="font-poppins text-lg text-brandDark font-bold uppercase mb-2">Đã xảy ra lỗi</h3>
          <p className="text-sm text-secondaryText mb-6">{error || 'Không tìm thấy dữ liệu khóa học.'}</p>
          <button onClick={onBack} className="px-6 py-2.5 rounded-[999px] bg-actionBlue text-white hover:bg-actionBlueHover transition text-sm font-semibold">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const isFree = course.courseType === 0;
  const priceText = isFree ? 'Miễn phí' : `${course.basePrice.toLocaleString('vi-VN')}đ`;

  return (
    <div className="min-h-screen bg-offWhite1 py-20">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">
        
        {/* ── NÚT QUAY LẠI ── */}
        <button 
          onClick={onBack} 
          className="group flex items-center gap-2 text-secondaryText hover:text-actionBlue transition-colors font-semibold text-xs uppercase tracking-wider mb-8"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </button>

        {/* ── BỐ CỤC CHÍNH (GRID 12 CỘT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN KHÓA HỌC (7 cột) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Badge Cấp độ */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`px-3 py-1 rounded-[6px] border text-xs font-bold uppercase tracking-wider ${getLevelBadgeStyles(course.level)}`}>
                  {getLevelLabel(course.level)}
                </span>
                <span className={`px-3 py-1 rounded-[6px] border text-xs font-bold uppercase tracking-wider ${
                  isFree ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-actionBlue border-blue-100'
                }`}>
                  {isFree ? 'Miễn phí' : 'Cao cấp'}
                </span>
              </div>

              {/* Tên khóa học */}
              <h1 className="font-poppins text-brandDark text-3xl sm:text-4xl font-extrabold leading-tight mb-5">
                {course.title}
              </h1>

              {/* Mô tả */}
              <p className="text-secondaryText text-sm sm:text-base leading-relaxed mb-8">
                {course.description}
              </p>

              {/* Grid thông số khóa học */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-grayBorder rounded-[12px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-secondaryText uppercase tracking-wider font-bold mb-1">Giảng viên</span>
                  <span className="text-sm font-semibold text-brandDark truncate">{course.createdByName}</span>
                </div>
                <div className="bg-white border border-grayBorder rounded-[12px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-secondaryText uppercase tracking-wider font-bold mb-1">Bài học</span>
                  <span className="text-sm font-semibold text-brandDark">{course.lessons.length} bài học</span>
                </div>
                <div className="bg-white border border-grayBorder rounded-[12px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-secondaryText uppercase tracking-wider font-bold mb-1">Thời lượng</span>
                  <span className="text-sm font-semibold text-brandDark">{getTotalDuration(course.lessons)}</span>
                </div>
                <div className="bg-white border border-grayBorder rounded-[12px] p-4 flex flex-col justify-center">
                  <span className="text-[10px] text-secondaryText uppercase tracking-wider font-bold mb-1">Học phí</span>
                  <span className="text-sm font-bold text-actionBlue">{priceText}</span>
                </div>
              </div>
            </div>

            {/* Nút Đăng Ký Học */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <button
                onClick={onEnroll}
                className="w-full sm:w-auto px-10 py-4 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-bold text-sm rounded-[999px] shadow-l1 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
              >
                {isLoggedIn ? 'Bắt đầu học ngay' : 'Đăng ký học ngay'}
              </button>
              
              {!isLoggedIn && (
                <p className="text-xs text-secondaryText font-medium max-w-xs text-center sm:text-left leading-relaxed">
                  * Đăng ký tài khoản để bắt đầu lưu trữ tiến trình và tham gia làm bài tập chấm điểm tự động.
                </p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TRÌNH PHÁT VIDEO PREVIEW (5 cột) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[24px] p-5 border border-grayBorder flex flex-col shadow-l1">
              
              {/* Tiêu đề xem trước */}
              <div className="flex items-center gap-2 mb-3.5 px-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-brandDark uppercase">
                  Xem trước: <span className="text-actionBlue font-bold">{activeVideoTitle}</span>
                </span>
              </div>
              
              {/* Khung chứa Video */}
              <div className="relative w-full aspect-video rounded-[16px] overflow-hidden bg-brandDark/90 border border-grayBorder shadow-inner">
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mô tả ngắn của preview */}
              <p className="text-center text-[11px] text-secondaryText mt-4 px-2 leading-relaxed">
                Học viên và khách vãng lai có thể phát thử các tài liệu video demo được mở công khai (Preview).
              </p>
            </div>
          </div>

        </div>

        {/* ── SYLLABUS SECTION (CHƯƠNG TRÌNH HỌC) ── */}
        <div className="mt-20">
          <div className="flex items-center justify-between border-b border-grayBorder pb-5 mb-8">
            <h2 className="font-poppins text-brandDark text-2xl font-bold tracking-tight">
              Chương trình học tập
            </h2>
            <span className="text-xs font-semibold text-secondaryText uppercase tracking-wider">
              {course.lessons.length} Bài học
            </span>
          </div>

          {/* Danh sách bài học */}
          {course.lessons.length === 0 ? (
            <div className="text-center py-10 text-secondaryText text-sm font-medium">
              Chưa có bài học nào được đăng tải cho khóa học này.
            </div>
          ) : (
            <div className="space-y-4">
              {course.lessons.map((lesson, idx) => {
                const isPreviewable = lesson.preview;
                return (
                  <div
                    key={lesson.id}
                    className={`bg-white border border-grayBorder rounded-[16px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
                      isPreviewable ? 'hover:bg-offWhite3 border-actionBlue/20 shadow-sm' : ''
                    }`}
                  >
                    
                    {/* Phần bên trái: Thứ tự & Tên bài học */}
                    <div className="flex items-start gap-4">
                      {/* Số thứ tự */}
                      <span className="font-poppins text-xl font-bold text-actionBlue/20 min-w-[2rem] pt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      
                      {/* Tiêu đề & Loại bài */}
                      <div>
                        <h4 className="font-poppins text-brandDark text-base font-bold leading-snug">
                          {lesson.title}
                        </h4>
                        
                        <div className="flex items-center gap-2.5 mt-1 text-xs text-secondaryText">
                          <span className="font-medium">
                            {getContentTypeLabel(lesson.contentType)}
                          </span>
                          {lesson.durationSeconds > 0 && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-darkGrayBorder" />
                              <span>
                                {formatDuration(lesson.durationSeconds)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phần bên phải: Trạng thái & Xem thử */}
                    <div className="flex items-center md:justify-end shrink-0 gap-3">
                      {isPreviewable ? (
                        <button
                          onClick={() => handleLessonPreview(lesson, idx)}
                          className="px-4 py-2 rounded-[999px] border border-actionBlue text-actionBlue hover:bg-actionBlue hover:text-white transition-all font-semibold text-xs uppercase flex items-center gap-1.5"
                        >
                          <Play size={12} fill="currentColor" />
                          Học thử (Preview)
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-secondaryText/60 font-semibold px-3 py-1.5 bg-offWhite1 border border-grayBorder rounded-md">
                          <Lock size={12} />
                          Cần đăng ký khóa học
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
