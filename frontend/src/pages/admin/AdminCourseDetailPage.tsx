import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Plus, Video, FileText, HelpCircle, Music, AlignLeft,
  GripVertical, Trash2, Upload, Loader2, X, Pencil,
} from 'lucide-react';
import {
  getAdminCourseDetail, createLesson, updateLesson, deleteLesson, uploadFile, getFileUrl,
  LEVEL_MAP, CONTENT_TYPE_LABEL,
  type CourseDetailDTO, type LessonDTO, type LessonCreateRequestDTO,
} from '../../services/adminService';

const CONTENT_TYPES = [
  { value: 0, label: 'Video', icon: Video, accept: 'video/*' },
  { value: 1, label: 'Audio', icon: Music, accept: 'audio/*' },
  { value: 2, label: 'Văn bản', icon: AlignLeft, accept: '' },
  { value: 3, label: 'PDF', icon: FileText, accept: '.pdf' },
  { value: 4, label: 'Bài tập Quiz', icon: HelpCircle, accept: '' },
];

function getContentIcon(type: number) {
  const map: Record<number, React.ElementType> = {
    0: Video,
    1: Music,
    2: AlignLeft,
    3: FileText,
    4: HelpCircle,
  };
  const Icon = map[type] ?? FileText;
  const colorMap: Record<number, string> = {
    0: 'text-blue-500',
    1: 'text-purple-500',
    2: 'text-gray-500',
    3: 'text-orange-500',
    4: 'text-green-500',
  };
  return <Icon size={18} className={colorMap[type] ?? 'text-gray-400'} />;
}

function formatDuration(seconds: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AdminCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add lesson modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<LessonCreateRequestDTO>({
    title: '', contentType: 0, contentUrl: '', textContent: '', durationSeconds: 0, isPreview: false, questions: [], attachments: [],
  });
  const [formError, setFormError] = useState('');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingLessonId(null);
    setForm({ title: '', contentType: 0, contentUrl: '', textContent: '', durationSeconds: 0, isPreview: false, questions: [], attachments: [] });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (lesson: LessonDTO) => {
    setEditingLessonId(lesson.id);
    setForm({
      title: lesson.title,
      contentType: lesson.contentType,
      contentUrl: lesson.contentUrl || '',
      textContent: lesson.textContent || '',
      durationSeconds: lesson.durationSeconds || 0,
      isPreview: lesson.preview,
      questions: lesson.questions || [],
      attachments: lesson.attachments || [],
    });
    setFormError('');
    setShowModal(true);
  };

  const handleAddQuestionTemplate = () => {
    const defaultMc = {
      id: `q-${(form.questions?.length || 0) + 1}`,
      type: 'MULTIPLE_CHOICE',
      prompt: '',
      options: ['A. ', 'B. ', 'C. ', 'D. '],
      correctAnswer: 'A',
      explanation: ''
    };
    setForm(f => ({
      ...f,
      questions: [...(f.questions || []), defaultMc]
    }));
  };

  const handleRemoveQuestion = (idx: number) => {
    setForm(f => ({
      ...f,
      questions: (f.questions || []).filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleUpdateQuestion = (qIdx: number, field: string, val: any) => {
    setForm(f => {
      const nextQuestions = [...(f.questions || [])];
      nextQuestions[qIdx] = {
        ...nextQuestions[qIdx],
        [field]: val
      };
      
      // Auto-set matching defaults if type changes
      if (field === 'type') {
        if (val === 'MULTIPLE_CHOICE') {
          nextQuestions[qIdx].options = ['A. ', 'B. ', 'C. ', 'D. '];
          nextQuestions[qIdx].correctAnswer = 'A';
          delete nextQuestions[qIdx].leftItems;
          delete nextQuestions[qIdx].rightItems;
        } else if (val === 'FILL_BLANK') {
          nextQuestions[qIdx].correctAnswer = '';
          delete nextQuestions[qIdx].options;
          delete nextQuestions[qIdx].leftItems;
          delete nextQuestions[qIdx].rightItems;
        } else if (val === 'MATCHING') {
          nextQuestions[qIdx].leftItems = [];
          nextQuestions[qIdx].rightItems = [];
          nextQuestions[qIdx].correctAnswer = {};
          delete nextQuestions[qIdx].options;
        }
      }

      return {
        ...f,
        questions: nextQuestions
      };
    });
  };

  const handleAddMatchingPair = (qIdx: number) => {
    setForm(f => {
      const nextQuestions = [...(f.questions || [])];
      const q = nextQuestions[qIdx];
      const correct = { ...(q.correctAnswer || {}) };
      correct['Word'] = 'Nghia';
      const left = [...(q.leftItems || []), 'Word'];
      const right = [...(q.rightItems || []), 'Nghia'];
      
      nextQuestions[qIdx] = {
        ...q,
        correctAnswer: correct,
        leftItems: left,
        rightItems: right
      };

      return { ...f, questions: nextQuestions };
    });
  };

  const handleRemoveMatchingPair = (qIdx: number, key: string, val: string) => {
    setForm(f => {
      const nextQuestions = [...(f.questions || [])];
      const q = nextQuestions[qIdx];
      const correct = { ...(q.correctAnswer || {}) };
      delete correct[key];
      
      const left = (q.leftItems || []).filter((item: string) => item !== key);
      const right = (q.rightItems || []).filter((item: string) => item !== val);

      nextQuestions[qIdx] = {
        ...q,
        correctAnswer: correct,
        leftItems: left,
        rightItems: right
      };

      return { ...f, questions: nextQuestions };
    });
  };
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCourse = () => {
    if (!courseId) return;
    setLoading(true);
    getAdminCourseDetail(courseId)
      .then(setCourse)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourse(); }, [courseId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const filename = await uploadFile(file);
      setForm(f => ({ ...f, contentUrl: getFileUrl(filename) }));
    } catch {
      setFormError('Upload file thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const filename = await uploadFile(file);
      const fileUrl = getFileUrl(filename);
      setForm(f => ({
        ...f,
        attachments: [...(f.attachments || []), { name: file.name, url: fileUrl }]
      }));
    } catch {
      setFormError('Upload tài liệu đính kèm thất bại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRenameAttachment = (index: number) => {
    const attachments = [...(form.attachments || [])];
    const currentName = attachments[index]?.name || '';
    const newName = prompt('Nhập tên mới cho tài liệu:', currentName);
    if (newName !== null && newName.trim() !== '') {
      attachments[index] = { ...attachments[index], name: newName.trim() };
      setForm(f => ({ ...f, attachments }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    if (!confirm('Bạn có chắc muốn xóa tài liệu đính kèm này khỏi bài học?')) return;
    setForm(f => ({
      ...f,
      attachments: (f.attachments || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddLesson = async () => {
    if (!form.title.trim()) { setFormError('Tiêu đề không được để trống.'); return; }
    if (!courseId) return;
    setSaving(true); setFormError('');
    try {
      if (editingLessonId) {
        await updateLesson(editingLessonId, form);
      } else {
        await createLesson(courseId, form);
      }
      setShowModal(false);
      setForm({ title: '', contentType: 0, contentUrl: '', textContent: '', durationSeconds: 0, isPreview: false, questions: [], attachments: [] });
      setEditingLessonId(null);
      fetchCourse();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Lưu bài học thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài học này?')) return;
    try {
      await deleteLesson(lessonId);
      setCourse(prev => prev ? { ...prev, lessons: prev.lessons.filter(l => l.id !== lessonId) } : prev);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Xóa bài học thất bại.');
    }
  };

  const sortedLessons: LessonDTO[] = course?.lessons
    ? [...course.lessons].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  const currentType = CONTENT_TYPES.find(t => t.value === form.contentType);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-secondaryText gap-3">
        <Loader2 size={20} className="animate-spin" /> Đang tải...
      </div>
    );
  }

  if (error || !course) {
    return <div className="py-10 text-center text-[#FF6B6B] text-sm">{error || 'Không tìm thấy khóa học.'}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/admin/courses" className="p-2 bg-white border border-grayBorder rounded-full hover:bg-offWhite1 transition-colors mt-1">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brandDark font-poppins">{course.title}</h1>
          <p className="text-sm text-secondaryText mt-1">
            {LEVEL_MAP[course.level]} · {course.basePrice > 0 ? `${course.basePrice.toLocaleString()}đ` : 'Miễn phí'}
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-actionBlue text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#004FD8] transition-colors"
        >
          <Plus size={16} /> Thêm bài học
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Syllabus */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm p-6">
            <h3 className="text-lg font-bold text-brandDark font-poppins mb-4">
              Danh sách Bài học ({sortedLessons.length})
            </h3>
            {sortedLessons.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={40} className="text-grayBorder mx-auto mb-3" />
                <p className="text-secondaryText text-sm">Chưa có bài học nào. Nhấn "Thêm bài học" để bắt đầu.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 border border-grayBorder rounded-xl hover:border-actionBlue transition-colors group bg-white"
                  >
                    <button className="text-grayBorder group-hover:text-secondaryText cursor-grab active:cursor-grabbing">
                      <GripVertical size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-offWhite1 flex items-center justify-center">
                      {getContentIcon(lesson.contentType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-brandDark truncate">{lesson.title}</h4>
                      <p className="text-xs text-secondaryText mt-0.5">
                        {CONTENT_TYPE_LABEL[lesson.contentType]}
                        {lesson.durationSeconds > 0 && ` · ${formatDuration(lesson.durationSeconds)}`}
                        {lesson.preview && ' · Xem trước'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenEditModal(lesson)}
                      className="p-2 text-actionBlue hover:bg-[#EBF3FF] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Sửa bài học"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2 text-[#FF6B6B] hover:bg-[#FFE5E5] rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa bài học"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course Info Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm p-6">
            <h3 className="text-base font-bold text-brandDark font-poppins mb-4">Thông tin khóa học</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondaryText">Trạng thái</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  course.status === 'PUBLISHED'
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    : 'bg-[#F9FAFB] text-secondaryText border-grayBorder'
                }`}>{course.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondaryText">Số bài học</span>
                <span className="font-semibold text-brandDark">{course.lessons?.length ?? 0}</span>
              </div>
              {course.createdByName && (
                <div className="flex justify-between">
                  <span className="text-secondaryText">Tạo bởi</span>
                  <span className="font-medium text-brandDark">{course.createdByName}</span>
                </div>
              )}
            </div>
            {course.description && (
              <>
                <hr className="my-4 border-grayBorder" />
                <p className="text-xs text-secondaryText leading-relaxed">{course.description}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-lg p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-offWhite1 rounded-full transition-colors"
            >
              <X size={20} className="text-secondaryText" />
            </button>
            <h2 className="text-xl font-bold text-brandDark font-poppins mb-6">{editingLessonId ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-brandDark block mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Nhập tiêu đề bài học..."
                  className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-brandDark block mb-2">Loại nội dung</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTENT_TYPES.map(ct => (
                    <button
                      key={ct.value}
                      onClick={() => setForm(f => ({ ...f, contentType: ct.value, contentUrl: '' }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                        form.contentType === ct.value
                          ? 'border-actionBlue bg-[#FAFCFE] text-actionBlue'
                          : 'border-grayBorder hover:border-actionBlue text-secondaryText'
                      }`}
                    >
                      <ct.icon size={16} /> {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.contentType === 4 ? (
                <div className="space-y-4 border-t border-grayBorder pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-brandDark">Danh sách câu hỏi ({form.questions?.length || 0})</label>
                    <button
                      type="button"
                      onClick={handleAddQuestionTemplate}
                      className="text-xs bg-actionBlue/10 text-actionBlue hover:bg-actionBlue/20 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} /> Thêm câu hỏi
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                    {(form.questions || []).map((q: any, qIdx: number) => (
                      <div key={q.id || qIdx} className="p-4 border border-grayBorder rounded-xl bg-offWhite1 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="absolute top-3 right-3 text-[#FF6B6B] hover:bg-[#FFE5E5] p-1.5 rounded-full transition-colors"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-secondaryText block mb-1">Loại câu hỏi</label>
                            <select
                              value={q.type}
                              onChange={e => handleUpdateQuestion(qIdx, 'type', e.target.value)}
                              className="w-full bg-white px-2 py-1.5 border border-grayBorder rounded-lg text-xs font-medium focus:border-actionBlue outline-none"
                            >
                              <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                              <option value="FILL_BLANK">Điền từ</option>
                              <option value="MATCHING">Ghép cặp</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-secondaryText block mb-1">ID câu hỏi</label>
                            <input
                              type="text"
                              value={q.id}
                              onChange={e => handleUpdateQuestion(qIdx, 'id', e.target.value)}
                              className="w-full bg-white px-2 py-1.5 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none"
                              placeholder="Ví dụ: q-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-secondaryText block mb-1">Đề bài (Prompt)</label>
                          <textarea
                            rows={2}
                            value={q.prompt}
                            onChange={e => handleUpdateQuestion(qIdx, 'prompt', e.target.value)}
                            className="w-full bg-white px-3 py-2 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none resize-none"
                            placeholder="Nhập câu hỏi..."
                          />
                        </div>

                        {q.type === 'MULTIPLE_CHOICE' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-secondaryText block">Các phương án lựa chọn</label>
                            <div className="grid grid-cols-2 gap-2">
                              {['A', 'B', 'C', 'D'].map((optPrefix, optIdx) => (
                                <div key={optPrefix} className="flex items-center gap-1">
                                  <span className="text-xs font-bold text-secondaryText">{optPrefix}.</span>
                                  <input
                                    type="text"
                                    value={q.options?.[optIdx]?.substring(3) || ''}
                                    onChange={e => {
                                      const newOpts = [...(q.options || ['A. ', 'B. ', 'C. ', 'D. '])];
                                      newOpts[optIdx] = `${optPrefix}. ${e.target.value}`;
                                      handleUpdateQuestion(qIdx, 'options', newOpts);
                                    }}
                                    className="w-full bg-white px-2 py-1.5 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none"
                                    placeholder={`Đáp án ${optPrefix}`}
                                  />
                                </div>
                              ))}
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-secondaryText block mb-1">Đáp án đúng</label>
                              <select
                                value={q.correctAnswer || 'A'}
                                onChange={e => handleUpdateQuestion(qIdx, 'correctAnswer', e.target.value)}
                                className="w-full bg-white px-2 py-1.5 border border-grayBorder rounded-lg text-xs font-medium focus:border-actionBlue outline-none"
                              >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {q.type === 'FILL_BLANK' && (
                          <div>
                            <label className="text-xs font-semibold text-secondaryText block mb-1">Đáp án đúng (Từ cần điền)</label>
                            <input
                              type="text"
                              value={q.correctAnswer || ''}
                              onChange={e => handleUpdateQuestion(qIdx, 'correctAnswer', e.target.value)}
                              className="w-full bg-white px-3 py-1.5 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none"
                              placeholder="Nhập đáp án..."
                            />
                          </div>
                        )}

                        {q.type === 'MATCHING' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold text-secondaryText">{"Các cặp từ ghép (English -> Vietnamese)"}</label>
                              <button
                                type="button"
                                onClick={() => handleAddMatchingPair(qIdx)}
                                className="text-[10px] bg-actionBlue/10 text-actionBlue hover:bg-actionBlue/20 px-2 py-1 rounded font-semibold transition-colors"
                              >
                                Thêm cặp ghép
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {Object.entries(q.correctAnswer || {}).map(([key, val]: [string, any], pairIdx) => (
                                <div key={pairIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={key}
                                    onChange={e => {
                                      const newCorrect = { ...(q.correctAnswer || {}) };
                                      delete newCorrect[key];
                                      newCorrect[e.target.value] = val;
                                      
                                      const newLeft = [...(q.leftItems || [])];
                                      const leftIdx = newLeft.indexOf(key);
                                      if (leftIdx > -1) newLeft[leftIdx] = e.target.value;
                                      else newLeft.push(e.target.value);

                                      handleUpdateQuestion(qIdx, 'correctAnswer', newCorrect);
                                      handleUpdateQuestion(qIdx, 'leftItems', newLeft);
                                    }}
                                    className="w-1/2 bg-white px-2 py-1.5 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none"
                                    placeholder="Từ tiếng Anh"
                                  />
                                  <span className="text-xs font-bold text-grayBorder">→</span>
                                  <input
                                    type="text"
                                    value={val}
                                    onChange={e => {
                                      const newCorrect = { ...(q.correctAnswer || {}) };
                                      newCorrect[key] = e.target.value;

                                      const newRight = [...(q.rightItems || [])];
                                      const rightIdx = newRight.indexOf(val);
                                      if (rightIdx > -1) newRight[rightIdx] = e.target.value;
                                      else newRight.push(e.target.value);

                                      handleUpdateQuestion(qIdx, 'correctAnswer', newCorrect);
                                      handleUpdateQuestion(qIdx, 'rightItems', newRight);
                                    }}
                                    className="w-1/2 bg-white px-2 py-1.5 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none"
                                    placeholder="Nghĩa tiếng Việt"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMatchingPair(qIdx, key, val)}
                                    className="text-[#FF6B6B] hover:bg-[#FFE5E5] p-1 rounded transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-xs font-semibold text-secondaryText block mb-1">Giải thích đáp án</label>
                          <input
                            type="text"
                            value={q.explanation || ''}
                            onChange={e => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                            className="w-full bg-white px-3 py-1.5 border border-grayBorder rounded-lg text-xs focus:border-actionBlue outline-none"
                            placeholder="Giải thích tại sao đáp án đúng..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : form.contentType === 2 ? (
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">Nội dung văn bản</label>
                  <textarea
                    rows={4}
                    value={form.textContent || ''}
                    onChange={e => setForm(f => ({ ...f, textContent: e.target.value }))}
                    placeholder="Nhập nội dung bài học..."
                    className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">
                    Upload {currentType?.label}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={currentType?.accept}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {form.contentUrl ? (
                    <div className="flex items-center gap-3 p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl">
                      <div className="text-[#2E7D32]">✓</div>
                      <span className="text-sm text-[#2E7D32] font-medium flex-1 truncate">File đã upload thành công</span>
                      <button onClick={() => setForm(f => ({ ...f, contentUrl: '' }))} className="text-secondaryText hover:text-brandDark">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-grayBorder rounded-xl text-sm font-medium text-secondaryText hover:text-actionBlue hover:border-actionBlue hover:bg-[#FAFCFE] disabled:opacity-60 transition-colors"
                    >
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploading ? 'Đang upload...' : `Chọn file ${currentType?.label}`}
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">Thời lượng (giây)</label>
                  <input
                    type="number"
                    value={form.durationSeconds || ''}
                    onChange={e => setForm(f => ({ ...f, durationSeconds: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                  />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isPreview}
                      onChange={e => setForm(f => ({ ...f, isPreview: e.target.checked }))}
                      className="w-4 h-4 accent-actionBlue"
                    />
                    <span className="text-sm font-semibold text-brandDark">Cho xem trước (Preview)</span>
                  </label>
                </div>
              </div>

              {/* Tài liệu đính kèm (Attachments) */}
              <div className="border-t border-grayBorder pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-brandDark block">
                    Tài liệu đính kèm bài học ({form.attachments?.length || 0})
                  </label>
                  <div>
                    <input
                      id="attachment-file-input"
                      type="file"
                      onChange={handleUploadAttachment}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('attachment-file-input')?.click()}
                      className="text-xs text-actionBlue hover:text-actionBlueHover font-bold flex items-center gap-1 bg-actionBlue/5 border border-actionBlue/10 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Plus size={14} /> Thêm tài liệu
                    </button>
                  </div>
                </div>

                {form.attachments && form.attachments.length > 0 ? (
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {form.attachments.map((att, attIdx) => (
                      <div key={attIdx} className="flex items-center justify-between gap-3 p-2 bg-offWhite1 border border-grayBorder rounded-xl text-xs">
                        <span className="font-medium text-brandDark truncate flex-1" title={att.name}>
                          📄 {att.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRenameAttachment(attIdx)}
                            className="p-1 text-actionBlue hover:bg-[#EBF3FF] rounded transition-colors"
                            title="Đổi tên tài liệu"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attIdx)}
                            className="p-1 text-[#FF6B6B] hover:bg-[#FFE5E5] rounded transition-colors"
                            title="Xóa tài liệu"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-secondaryText italic bg-offWhite1/50 border border-dashed border-grayBorder rounded-xl p-3 text-center">
                    Chưa có tài liệu đính kèm nào được tải lên cho bài học này.
                  </p>
                )}
              </div>

              {formError && <p className="text-[#FF6B6B] text-sm">{formError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm font-semibold text-secondaryText hover:bg-offWhite1 rounded-full transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddLesson}
                  disabled={saving || uploading}
                  className="flex items-center gap-2 bg-actionBlue text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#004FD8] disabled:opacity-60 transition-colors"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Đang lưu...' : (editingLessonId ? 'Lưu thay đổi' : 'Thêm bài học')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
