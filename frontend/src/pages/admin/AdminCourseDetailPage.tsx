import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Video, FileText, HelpCircle, GripVertical } from 'lucide-react';

const mockCourse = {
  id: '1',
  title: 'English for Absolute Beginners',
  status: 'Published',
  lessons: [
    { id: 'l1', title: 'Bài 1: Bảng chữ cái và Phát âm cơ bản', type: 'video', duration: '15:20' },
    { id: 'l2', title: 'Bài 2: Chào hỏi trong giao tiếp', type: 'video', duration: '12:45' },
    { id: 'l3', title: 'Quiz 1: Kiểm tra phát âm', type: 'quiz', duration: '10 câu hỏi' },
    { id: 'l4', title: 'Tài liệu: Bảng từ vựng Unit 1', type: 'document', duration: 'PDF' },
  ]
};

export default function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const course = mockCourse; 

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={18} className="text-blue-500" />;
      case 'document': return <FileText size={18} className="text-orange-500" />;
      case 'quiz': return <HelpCircle size={18} className="text-purple-500" />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/courses" className="p-2 bg-white border border-grayBorder rounded-full hover:bg-offWhite1 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">{course.title}</h1>
          <p className="text-sm text-secondaryText mt-1">Quản lý nội dung và bài giảng ({courseId})</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="bg-white border border-grayBorder text-brandDark px-4 py-2 rounded-full font-semibold text-sm hover:bg-offWhite1 transition-colors">
            Cài đặt khóa học
          </button>
          <button className="flex items-center gap-2 bg-actionBlue text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#004FD8] active:bg-[#003FA8] transition-colors">
            <Plus size={16} />
            <span>Thêm nội dung</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Syllabus */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm p-6">
            <h3 className="text-lg font-bold text-brandDark font-poppins mb-4">Danh sách Bài học (Syllabus)</h3>
            <div className="space-y-3">
              {course.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-4 p-4 border border-grayBorder rounded-xl hover:border-actionBlue transition-colors group bg-white">
                  <button className="text-grayBorder group-hover:text-secondaryText cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-offWhite1 flex items-center justify-center">
                    {getIcon(lesson.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-brandDark">{lesson.title}</h4>
                    <p className="text-xs text-secondaryText mt-0.5">{lesson.duration}</p>
                  </div>
                  <button className="text-sm font-semibold text-actionBlue opacity-0 group-hover:opacity-100 transition-opacity">
                    Chỉnh sửa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stats or Upload Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm p-6">
            <h3 className="text-lg font-bold text-brandDark font-poppins mb-4">Trạng thái</h3>
            <div className="flex items-center justify-between p-3 bg-offWhite1 rounded-xl">
              <span className="text-sm font-medium text-secondaryText">Hiển thị</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.status === 'Published' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#F9FAFB] text-secondaryText'
              }`}>
                {course.status}
              </span>
            </div>
            
            <hr className="my-6 border-grayBorder" />
            
            <h3 className="text-sm font-bold text-brandDark font-poppins mb-3">Tải lên nhanh</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-grayBorder rounded-xl text-sm font-medium text-secondaryText hover:text-actionBlue hover:border-actionBlue hover:bg-[#FAFCFE] transition-colors">
                <Video size={16} />
                Upload Video
              </button>
              <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-grayBorder rounded-xl text-sm font-medium text-secondaryText hover:text-actionBlue hover:border-actionBlue hover:bg-[#FAFCFE] transition-colors">
                <FileText size={16} />
                Upload Tài liệu PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
