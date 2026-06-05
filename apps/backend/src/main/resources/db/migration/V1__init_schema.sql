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
    CertificateCode NVARCHAR(100), -- Chỉ cho phép unique với giá trị khác NULL
    EnrolledAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Tạo Index unique cho CertificateCode bỏ qua NULL
CREATE UNIQUE NONCLUSTERED INDEX UQ_Enrollments_CertificateCode 
ON Enrollments(CertificateCode) 
WHERE CertificateCode IS NOT NULL;

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

-- ============================================================
-- INSERT DEMO DATA (COURSES & LESSONS)
-- ============================================================

INSERT INTO Courses (Title, Level, Price, Status, Metadata) VALUES
(N'English for Absolute Beginners', 0, 199000, 1, N'{"description": "Cấp độ: A1. Thời lượng: 6 tuần. Khóa học lý tưởng cho người mới bắt đầu làm quen với tiếng Anh.", "thumbnailUrl": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80"}'),
(N'Everyday English Communication', 0, 299000, 1, N'{"description": "Cấp độ: A2. Thời lượng: 8 tuần. Cải thiện khả năng giao tiếp tiếng Anh trong các tình huống hàng ngày.", "thumbnailUrl": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80"}'),
(N'English Grammar & Vocabulary Foundation', 1, 399000, 1, N'{"description": "Cấp độ: A2+. Thời lượng: 8 tuần. Xây dựng nền tảng ngữ pháp và từ vựng vững chắc.", "thumbnailUrl": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"}'),
(N'Intermediate English Skills', 1, 599000, 1, N'{"description": "Cấp độ: B1. Thời lượng: 10 tuần. Phát triển đồng đều cả 4 kỹ năng nghe, nói, đọc, viết.", "thumbnailUrl": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"}'),
(N'Advanced English Communication', 2, 899000, 1, N'{"description": "Cấp độ: B2. Thời lượng: 12 tuần. Tự tin giao tiếp tiếng Anh lưu loát như người bản xứ.", "thumbnailUrl": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"}'),
(N'Mastering Professional English', 2, 1299000, 1, N'{"description": "Cấp độ: C1-C2. Thời lượng: 16 tuần. Tiếng Anh chuyên nghiệp dùng trong môi trường học thuật và kinh doanh.", "thumbnailUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"}');


DECLARE @Course1 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Courses WHERE Title = 'English for Absolute Beginners');
IF @Course1 IS NOT NULL
BEGIN
    INSERT INTO Lessons (CourseId, Title, IsPreview, OrderIndex, Type, Content) VALUES
    (@Course1, N'Bài 1: Giới thiệu chung và Bảng chữ cái', 1, 1, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4", "textContent": "Chào mừng bạn đến với khóa học cơ bản."}'),
    (@Course1, N'Bài 2: Chào hỏi cơ bản', 0, 2, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4", "textContent": "Học cách chào hỏi thông dụng."}'),
    (@Course1, N'Bài 3: Bài tập kiểm tra', 0, 3, 1, N'{"deadline": "2026-12-31", "questions": [{"q": "How are you?", "type": "quiz", "options": ["I am fine", "I am a student"], "answer": "A"}]}');
END

DECLARE @Course2 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Courses WHERE Title = 'Everyday English Communication');
IF @Course2 IS NOT NULL
BEGIN
    INSERT INTO Lessons (CourseId, Title, IsPreview, OrderIndex, Type, Content) VALUES
    (@Course2, N'Bài 1: Giao tiếp tại nhà hàng', 1, 1, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4", "textContent": "Mẫu câu gọi món tại nhà hàng."}'),
    (@Course2, N'Bài 2: Đặt phòng khách sạn', 0, 2, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4", "textContent": "Hướng dẫn check-in và check-out."}');
END

DECLARE @Course3 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Courses WHERE Title = 'English Grammar & Vocabulary Foundation');
IF @Course3 IS NOT NULL
BEGIN
    INSERT INTO Lessons (CourseId, Title, IsPreview, OrderIndex, Type, Content) VALUES
    (@Course3, N'Bài 1: Thì hiện tại đơn và tiếp diễn', 1, 1, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4", "textContent": "Phân biệt 2 thì cơ bản nhất."}'),
    (@Course3, N'Bài 2: Trắc nghiệm ngữ pháp', 0, 2, 1, N'{"deadline": "2026-12-31", "questions": [{"q": "She _____ to school everyday.", "type": "quiz", "options": ["goes", "going"], "answer": "A"}]}');
END

DECLARE @Course4 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Courses WHERE Title = 'Intermediate English Skills');
IF @Course4 IS NOT NULL
BEGIN
    INSERT INTO Lessons (CourseId, Title, IsPreview, OrderIndex, Type, Content) VALUES
    (@Course4, N'Bài 1: Kỹ năng nghe hiểu bản xứ', 1, 1, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4", "textContent": "Luyện nghe giọng chuẩn."}');
END

DECLARE @Course5 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Courses WHERE Title = 'Advanced English Communication');
IF @Course5 IS NOT NULL
BEGIN
    INSERT INTO Lessons (CourseId, Title, IsPreview, OrderIndex, Type, Content) VALUES
    (@Course5, N'Bài 1: Giao tiếp lưu loát', 1, 1, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4", "textContent": "Luyện tập kỹ thuật nối âm."}');
END

DECLARE @Course6 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM Courses WHERE Title = 'Mastering Professional English');
IF @Course6 IS NOT NULL
BEGIN
    INSERT INTO Lessons (CourseId, Title, IsPreview, OrderIndex, Type, Content) VALUES
    (@Course6, N'Bài 1: Tiếng Anh trong phòng họp', 1, 1, 0, N'{"url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4", "textContent": "Cách trình bày ý kiến chuyên nghiệp."}');
END
