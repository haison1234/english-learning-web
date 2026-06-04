-- ============================================================
--  E-LEARNING DATABASE (TỐI ƯU CỰC HẠN)
--  Giảm từ 14 bảng xuống còn 7 Bảng - Tận dụng sức mạnh của kiểu JSON
--  Lược bỏ tối đa các trường rườm rà nhưng vẫn đáp ứng 100% User Stories
-- ============================================================

-- 1. USERS (Gộp Cấu hình thông báo, Xác thực Token vào chung)
-- Xử lý: Đăng nhập/Đăng ký, Phân quyền Admin/Student, Reset Pass
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(512),
    Role TINYINT DEFAULT 1, -- 0: Admin, 1: Student
    VerifyToken NVARCHAR(512), -- Dùng chung để lưu token Xác thực Email / Quên mật khẩu
    Metadata NVARCHAR(MAX), -- JSON: lưu các trường phụ (AvatarUrl, NotificationSettings bật/tắt, GoogleId)
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- 2. COURSES (Khóa học)
-- Các trường ít dùng để query (Description, Thumbnail, Trailer) được nhét vào Metadata
CREATE TABLE Courses (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    Title NVARCHAR(300) NOT NULL,
    Level TINYINT NOT NULL, -- 0: Beginner, 1: Intermediate, 2: Advanced (Để lọc nên giữ thành cột)
    Price DECIMAL(12,0) DEFAULT 0, -- 0 = Free
    Status TINYINT DEFAULT 0, -- 0: Draft, 1: Published
    Metadata NVARCHAR(MAX), -- JSON: { "description": "...", "thumbnailUrl": "...", "trailerUrl": "..." }
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- 3. LESSONS (Gộp Bài học + Bài tập + Câu hỏi vào 1 bảng duy nhất)
CREATE TABLE Lessons (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    CourseId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Courses(Id),
    Title NVARCHAR(300) NOT NULL,
    IsPreview BIT DEFAULT 0, -- 1: Khách học thử
    OrderIndex INT DEFAULT 0,
    Type TINYINT, -- 0: Bài học (Video/Audio/Text), 1: Bài tập (Quiz)
    Content NVARCHAR(MAX) 
    /* Đóng gói toàn bộ nội dung vào JSON:
       - Nếu Type=0 -> { "url": "video_url.mp4", "textContent": "..." }
       - Nếu Type=1 -> { 
            "deadline": "2023-12-31", 
            "questions": [ 
               { "q": "Câu hỏi 1?", "type": "quiz", "options": ["A","B"], "answer": "A" } 
            ] 
         }
    */
);

-- 4. COUPONS
-- Lấy luôn Code làm Khóa chính để giảm thiểu Id sinh ra
CREATE TABLE Coupons (
    Code NVARCHAR(50) PRIMARY KEY, 
    DiscountValue DECIMAL(12,0),
    IsPercent BIT DEFAULT 1, -- 1: Giảm %, 0: Giảm tiền mặt
    MaxUses INT,
    UsedCount INT DEFAULT 0,
    ExpiresAt DATETIME2
);

-- 5. ENROLLMENTS (Gộp Ghi danh + Thanh toán + Tiến độ + Nộp bài + Chứng chỉ vào 1 Bảng)
CREATE TABLE Enrollments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    CourseId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Courses(Id),
    
    -- Xử lý Thanh toán
    PaymentStatus TINYINT DEFAULT 0, -- 0: Pending, 1: Success (Khóa free mặc định 1)
    Amount DECIMAL(12,0) DEFAULT 0,
    CouponCode NVARCHAR(50) FOREIGN KEY REFERENCES Coupons(Code),
    
    -- Xử lý Tiến độ học & Nộp bài tập
    ProgressData NVARCHAR(MAX), 
    /* JSON lưu vết tất cả:
       { 
         "lessonId_1": { "completed": true, "pos": 120 },
         "lessonId_2": { "completed": true, "score": 8.5, "answers": [...] }
       }
    */
    
    -- Xử lý Chứng chỉ
    CertificateCode NVARCHAR(100) UNIQUE, -- Nếu != NULL nghĩa là đã hoàn thành 100% khóa học
    EnrolledAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- 6. COMMENTS (Hỏi đáp & Bình luận)
CREATE TABLE Comments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    LessonId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Lessons(Id),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    ParentId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Comments(Id), -- Phản hồi
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- 7. NOTIFICATIONS (Thông báo)
CREATE TABLE Notifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    UserId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(Id),
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);
