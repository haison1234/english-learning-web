-- ============================================================
--  E-LEARNING DATABASE  |  SQL Server
--  SEED DATA v2 - Tương thích SQL Server (dùng bảng tạm #IDs)
--  Chạy sau khi đã tạo xong schema ELearningDB
-- ============================================================

USE ELearningDB;
GO

-- ============================================================
--  BẢNG TẠM LƯU ID (tồn tại xuyên suốt session)
-- ============================================================
IF OBJECT_ID('tempdb..#IDs') IS NOT NULL DROP TABLE #IDs;
CREATE TABLE #IDs (Name NVARCHAR(50) PRIMARY KEY, Id UNIQUEIDENTIFIER);

INSERT INTO #IDs VALUES
-- Users
('Admin',    '11111111-0000-0000-0000-000000000001'),
('Student1', '22222222-0000-0000-0000-000000000001'),
('Student2', '22222222-0000-0000-0000-000000000002'),
('Student3', '22222222-0000-0000-0000-000000000003'),
('Student4', '22222222-0000-0000-0000-000000000004'),
('Guest',    '33333333-0000-0000-0000-000000000001'),
-- Courses
('Course1',  'AAAA0001-0000-0000-0000-000000000000'),
('Course2',  'AAAA0002-0000-0000-0000-000000000000'),
('Course3',  'AAAA0003-0000-0000-0000-000000000000'),
('Course4',  'AAAA0004-0000-0000-0000-000000000000'),
-- Lessons C1
('L1_1', 'BBBB0101-0000-0000-0000-000000000000'),
('L1_2', 'BBBB0102-0000-0000-0000-000000000000'),
('L1_3', 'BBBB0103-0000-0000-0000-000000000000'),
('L1_4', 'BBBB0104-0000-0000-0000-000000000000'),
-- Lessons C2
('L2_1', 'BBBB0201-0000-0000-0000-000000000000'),
('L2_2', 'BBBB0202-0000-0000-0000-000000000000'),
('L2_3', 'BBBB0203-0000-0000-0000-000000000000'),
('L2_4', 'BBBB0204-0000-0000-0000-000000000000'),
('L2_5', 'BBBB0205-0000-0000-0000-000000000000'),
-- Lessons C3
('L3_1', 'BBBB0301-0000-0000-0000-000000000000'),
('L3_2', 'BBBB0302-0000-0000-0000-000000000000'),
('L3_3', 'BBBB0303-0000-0000-0000-000000000000'),
-- Coupons
('Coupon1', 'CCCC0001-0000-0000-0000-000000000000'),
('Coupon2', 'CCCC0002-0000-0000-0000-000000000000'),
('Coupon3', 'CCCC0003-0000-0000-0000-000000000000'),
-- Payments
('Pay1', 'DDDD0001-0000-0000-0000-000000000000'),
('Pay2', 'DDDD0002-0000-0000-0000-000000000000'),
('Pay3', 'DDDD0003-0000-0000-0000-000000000000'),
('Pay4', 'DDDD0004-0000-0000-0000-000000000000'),
('Pay5', 'DDDD0005-0000-0000-0000-000000000000'),
('Pay6', 'DDDD0006-0000-0000-0000-000000000000'),
-- Enrollments
('Enr1', 'EEEE0001-0000-0000-0000-000000000000'),
('Enr2', 'EEEE0002-0000-0000-0000-000000000000'),
('Enr3', 'EEEE0003-0000-0000-0000-000000000000'),
('Enr4', 'EEEE0004-0000-0000-0000-000000000000'),
('Enr5', 'EEEE0005-0000-0000-0000-000000000000'),
('Enr6', 'EEEE0006-0000-0000-0000-000000000000'),
('Enr7', 'EEEE0007-0000-0000-0000-000000000000'),
('Enr8', 'EEEE0008-0000-0000-0000-000000000000'),
-- Assignments
('Asgn1', 'FFFF0001-0000-0000-0000-000000000000'),
('Asgn2', 'FFFF0002-0000-0000-0000-000000000000'),
('Asgn3', 'FFFF0003-0000-0000-0000-000000000000'),
-- Questions
('Q1_1', '99990101-0000-0000-0000-000000000000'),
('Q1_2', '99990102-0000-0000-0000-000000000000'),
('Q1_3', '99990103-0000-0000-0000-000000000000'),
('Q2_1', '99990201-0000-0000-0000-000000000000'),
('Q2_2', '99990202-0000-0000-0000-000000000000'),
('Q3_1', '99990301-0000-0000-0000-000000000000'),
('Q3_2', '99990302-0000-0000-0000-000000000000'),
-- Certificates
('Cert1', '88880001-0000-0000-0000-000000000000'),
-- Comments
('Cmt1', '77770001-0000-0000-0000-000000000000'),
('Cmt2', '77770002-0000-0000-0000-000000000000'),
('Cmt3', '77770003-0000-0000-0000-000000000000'),
('Cmt4', '77770004-0000-0000-0000-000000000000'),
('Cmt5', '77770005-0000-0000-0000-000000000000');
GO

-- ============================================================
--  1. USERS
-- ============================================================
INSERT INTO Users (Id, FullName, Email, PasswordHash, AvatarUrl, Role, Status, EmailVerified, OAuthProvider, OAuthId)
SELECT Id, FullName, Email, PasswordHash, AvatarUrl, Role, Status, EmailVerified, OAuthProvider, OAuthId
FROM (VALUES
    ((SELECT Id FROM #IDs WHERE Name='Admin'),
     N'Nguyễn Văn Admin', 'admin@elearning.vn',
     '$2a$12$KIxGUv5WqRzQpL8mNhJdUe4VxHsTyBmFcDjN3aWpOqR7LzMeKvXsG',
     'https://cdn.elearning.vn/avatars/admin.jpg', 2, 1, 1, NULL, NULL),

    ((SELECT Id FROM #IDs WHERE Name='Student1'),
     N'Trần Thị Lan', 'lan.tran@gmail.com',
     '$2a$12$AbCdEfGhIjKlMnOpQrStUuWxYz012345678ABCDEFGHIJKLMNOPQRs',
     'https://cdn.elearning.vn/avatars/student1.jpg', 1, 1, 1, NULL, NULL),

    ((SELECT Id FROM #IDs WHERE Name='Student2'),
     N'Lê Minh Tuấn', 'tuan.le@gmail.com',
     '$2a$12$XyZaBcDeFgHiJkLmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXy',
     'https://cdn.elearning.vn/avatars/student2.jpg', 1, 1, 1, NULL, NULL),

    ((SELECT Id FROM #IDs WHERE Name='Student3'),
     N'Phạm Quốc Hùng', 'hung.pham@yahoo.com',
     NULL,
     'https://lh3.googleusercontent.com/avatar/hung_pham', 1, 1, 1, 'google', 'google_oauth_id_hung_001'),

    ((SELECT Id FROM #IDs WHERE Name='Student4'),
     N'Đỗ Thị Mai', 'mai.do@outlook.com',
     '$2a$12$MnOpQrStUvWxYz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcde',
     NULL, 1, 1, 0, NULL, NULL),

    ((SELECT Id FROM #IDs WHERE Name='Guest'),
     N'Khách Vãng Lai', 'guest@example.com',
     '$2a$12$GuestHashPlaceholder12345678901234567890123456789012345a',
     NULL, 0, 1, 0, NULL, NULL)
) v(Id, FullName, Email, PasswordHash, AvatarUrl, Role, Status, EmailVerified, OAuthProvider, OAuthId);
GO

-- ============================================================
--  2. EMAIL VERIFICATION TOKENS
-- ============================================================
INSERT INTO EmailVerificationTokens (UserId, Token, ExpiresAt, UsedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Student1'),
 'evtoken_student1_verify_used_abc123',
 DATEADD(HOUR, 24, '2024-01-10 08:00:00'), '2024-01-10 09:30:00'),

((SELECT Id FROM #IDs WHERE Name='Student4'),
 'evtoken_student4_active_xyz789',
 DATEADD(HOUR, 24, SYSUTCDATETIME()), NULL);
GO

-- ============================================================
--  3. PASSWORD RESET TOKENS
-- ============================================================
INSERT INTO PasswordResetTokens (UserId, Token, ExpiresAt, UsedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Student2'),
 'reset_token_tuan_le_used_abc123def456',
 DATEADD(HOUR, 1, '2024-02-15 10:00:00'), '2024-02-15 10:45:00'),

((SELECT Id FROM #IDs WHERE Name='Student1'),
 'reset_token_lan_tran_expired_xyz789',
 '2024-03-01 12:00:00', NULL);
GO

-- ============================================================
--  4. COURSES
-- ============================================================
INSERT INTO Courses (Id, Title, Description, Level, CourseType, BasePrice,
                     ThumbnailUrl, TrailerUrl, Status, CreatedBy)
VALUES
((SELECT Id FROM #IDs WHERE Name='Course1'),
 N'Python Cơ Bản Cho Người Mới Bắt Đầu',
 N'Khóa học Python toàn diện dành cho người chưa có kinh nghiệm lập trình. Học từ biến, vòng lặp, hàm đến các dự án thực tế. Hơn 5.000 học viên đã hoàn thành!',
 0, 0, 0,
 'https://cdn.elearning.vn/thumbs/python-basic.jpg',
 'https://cdn.elearning.vn/trailers/python-basic-trailer.mp4',
 1, (SELECT Id FROM #IDs WHERE Name='Admin')),

((SELECT Id FROM #IDs WHERE Name='Course2'),
 N'Lập Trình Web Fullstack: Node.js + React',
 N'Xây dựng ứng dụng web hoàn chỉnh với Node.js, Express, MongoDB ở back-end và React ở front-end. Bao gồm xác thực JWT, REST API và deploy lên cloud.',
 1, 1, 1490000,
 'https://cdn.elearning.vn/thumbs/fullstack-web.jpg',
 'https://cdn.elearning.vn/trailers/fullstack-trailer.mp4',
 1, (SELECT Id FROM #IDs WHERE Name='Admin')),

((SELECT Id FROM #IDs WHERE Name='Course3'),
 N'SQL Server Nâng Cao: Tối Ưu & Thiết Kế CSDL',
 N'Nắm vững Stored Procedures, Indexing, Query Optimization, Partitioning và High Availability. Phù hợp DBA và Developer muốn nâng cao kỹ năng SQL Server.',
 2, 1, 990000,
 'https://cdn.elearning.vn/thumbs/sql-server-advanced.jpg',
 'https://cdn.elearning.vn/trailers/sql-advanced-trailer.mp4',
 1, (SELECT Id FROM #IDs WHERE Name='Admin')),

((SELECT Id FROM #IDs WHERE Name='Course4'),
 N'Phát Triển App Mobile với React Native',
 N'Tạo ứng dụng iOS và Android bằng một codebase duy nhất với React Native và Expo. Từ UI components đến gọi API và publish lên Store.',
 1, 1, 1290000,
 'https://cdn.elearning.vn/thumbs/react-native.jpg',
 NULL,
 0, (SELECT Id FROM #IDs WHERE Name='Admin'));
GO

-- ============================================================
--  5. LESSONS
-- ============================================================

-- Khóa 1: Python (4 bài)
INSERT INTO Lessons (Id, CourseId, Title, ContentType, ContentUrl, TextContent,
                     DurationSeconds, OrderIndex, IsPreview)
VALUES
((SELECT Id FROM #IDs WHERE Name='L1_1'),
 (SELECT Id FROM #IDs WHERE Name='Course1'),
 N'Bài 1: Giới Thiệu Python & Cài Đặt Môi Trường',
 0, 'https://cdn.elearning.vn/videos/python/01-intro.mp4', NULL, 900, 1, 1),

((SELECT Id FROM #IDs WHERE Name='L1_2'),
 (SELECT Id FROM #IDs WHERE Name='Course1'),
 N'Bài 2: Biến, Kiểu Dữ Liệu và Toán Tử',
 0, 'https://cdn.elearning.vn/videos/python/02-variables.mp4', NULL, 1200, 2, 0),

((SELECT Id FROM #IDs WHERE Name='L1_3'),
 (SELECT Id FROM #IDs WHERE Name='Course1'),
 N'Bài 3: Câu Lệnh Điều Kiện và Vòng Lặp',
 0, 'https://cdn.elearning.vn/videos/python/03-control-flow.mp4', NULL, 1500, 3, 0),

((SELECT Id FROM #IDs WHERE Name='L1_4'),
 (SELECT Id FROM #IDs WHERE Name='Course1'),
 N'Bài 4: Hàm và Module trong Python',
 2, NULL,
 N'## Hàm trong Python

Hàm là khối mã có thể tái sử dụng. Cú pháp:

```python
def ten_ham(tham_so):
    # thân hàm
    return ket_qua
```

### Ví dụ thực tế
```python
def tinh_tong(a, b):
    return a + b

ket_qua = tinh_tong(3, 5)
print(ket_qua)  # Output: 8
```

## Module
Dùng `import` để sử dụng thư viện có sẵn: `import math`, `import os`.',
 0, 4, 0);

-- Khóa 2: Fullstack (5 bài)
INSERT INTO Lessons (Id, CourseId, Title, ContentType, ContentUrl, TextContent,
                     DurationSeconds, OrderIndex, IsPreview)
VALUES
((SELECT Id FROM #IDs WHERE Name='L2_1'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 N'Bài 1: Tổng Quan Kiến Trúc Fullstack',
 0, 'https://cdn.elearning.vn/videos/fullstack/01-overview.mp4', NULL, 1200, 1, 1),

((SELECT Id FROM #IDs WHERE Name='L2_2'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 N'Bài 2: Xây Dựng REST API với Express.js',
 0, 'https://cdn.elearning.vn/videos/fullstack/02-express-api.mp4', NULL, 2700, 2, 0),

((SELECT Id FROM #IDs WHERE Name='L2_3'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 N'Bài 3: Kết Nối MongoDB & Mongoose',
 0, 'https://cdn.elearning.vn/videos/fullstack/03-mongodb.mp4', NULL, 2400, 3, 0),

((SELECT Id FROM #IDs WHERE Name='L2_4'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 N'Bài 4: Xây Dựng UI với React',
 0, 'https://cdn.elearning.vn/videos/fullstack/04-react-ui.mp4', NULL, 3000, 4, 0),

((SELECT Id FROM #IDs WHERE Name='L2_5'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 N'Bài 5: Xác Thực JWT & Deploy lên Railway',
 0, 'https://cdn.elearning.vn/videos/fullstack/05-jwt-deploy.mp4', NULL, 2100, 5, 0);

-- Khóa 3: SQL Server (3 bài)
INSERT INTO Lessons (Id, CourseId, Title, ContentType, ContentUrl, TextContent,
                     DurationSeconds, OrderIndex, IsPreview)
VALUES
((SELECT Id FROM #IDs WHERE Name='L3_1'),
 (SELECT Id FROM #IDs WHERE Name='Course3'),
 N'Bài 1: Indexing & Execution Plan',
 0, 'https://cdn.elearning.vn/videos/sql/01-indexing.mp4', NULL, 3600, 1, 1),

((SELECT Id FROM #IDs WHERE Name='L3_2'),
 (SELECT Id FROM #IDs WHERE Name='Course3'),
 N'Bài 2: Stored Procedures & Transactions',
 0, 'https://cdn.elearning.vn/videos/sql/02-sp-transaction.mp4', NULL, 3300, 2, 0),

((SELECT Id FROM #IDs WHERE Name='L3_3'),
 (SELECT Id FROM #IDs WHERE Name='Course3'),
 N'Bài 3: Tài Liệu Tham Khảo - Query Optimization Checklist',
 3, 'https://cdn.elearning.vn/pdfs/sql/query-optimization.pdf', NULL, 0, 3, 0);
GO

-- ============================================================
--  6. COUPONS
-- ============================================================
INSERT INTO Coupons (Id, Code, DiscountType, DiscountValue, MaxUses, UsedCount, ExpiresAt, CreatedBy)
VALUES
((SELECT Id FROM #IDs WHERE Name='Coupon1'),
 'WELCOME20', 0, 20.00, 100, 3,
 DATEADD(MONTH, 6, SYSUTCDATETIME()),
 (SELECT Id FROM #IDs WHERE Name='Admin')),

((SELECT Id FROM #IDs WHERE Name='Coupon2'),
 'SALE200K', 1, 200000.00, 50, 49,
 DATEADD(MONTH, 1, SYSUTCDATETIME()),
 (SELECT Id FROM #IDs WHERE Name='Admin')),

((SELECT Id FROM #IDs WHERE Name='Coupon3'),
 'EXPIRED10', 0, 10.00, 10, 2,
 '2024-01-01 00:00:00',
 (SELECT Id FROM #IDs WHERE Name='Admin'));
GO

-- ============================================================
--  7. PAYMENTS
-- ============================================================
INSERT INTO Payments (Id, UserId, CourseId, CouponId, OriginalPrice, DiscountAmount,
                      FinalPrice, Currency, Method, TransactionRef, Status, GatewayResponse, PaidAt)
VALUES
-- Student1 mua Course2 - VNPay - thành công
((SELECT Id FROM #IDs WHERE Name='Pay1'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Course2'), NULL,
 1490000, 0, 1490000, 'VND', 0, 'VNPAY20240315143022', 1,
 N'{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_BankCode":"VCB","vnp_Amount":"149000000"}',
 '2024-03-15 14:30:22'),

-- Student2 mua Course2 - Momo - thành công
((SELECT Id FROM #IDs WHERE Name='Pay2'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 (SELECT Id FROM #IDs WHERE Name='Course2'), NULL,
 1490000, 0, 1490000, 'VND', 1, 'MOMO_TXN_9876543210', 1,
 N'{"resultCode":0,"message":"Successful.","transId":9876543210,"amount":1490000}',
 '2024-03-20 09:15:45'),

-- Student1 mua Course3 - BankCard - thành công
((SELECT Id FROM #IDs WHERE Name='Pay3'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Course3'), NULL,
 990000, 0, 990000, 'VND', 2, 'BANKCARD_REF_20240401', 1,
 N'{"status":"success","bankRefNo":"BANKCARD_REF_20240401","amount":990000}',
 '2024-04-01 11:00:00'),

-- Student3 mua Course4 - VNPay - thành công
((SELECT Id FROM #IDs WHERE Name='Pay4'),
 (SELECT Id FROM #IDs WHERE Name='Student3'),
 (SELECT Id FROM #IDs WHERE Name='Course4'), NULL,
 1290000, 0, 1290000, 'VND', 0, 'VNPAY20240410171530', 1,
 N'{"vnp_ResponseCode":"00","vnp_TransactionStatus":"00","vnp_BankCode":"TCB","vnp_Amount":"129000000"}',
 '2024-04-10 17:15:30'),

-- Student4 mua Course2 - dùng coupon WELCOME20 (giảm 20%)
((SELECT Id FROM #IDs WHERE Name='Pay5'),
 (SELECT Id FROM #IDs WHERE Name='Student4'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 (SELECT Id FROM #IDs WHERE Name='Coupon1'),
 1490000, 298000, 1192000, 'VND', 1, 'MOMO_TXN_1122334455', 1,
 N'{"resultCode":0,"message":"Successful.","transId":1122334455,"amount":1192000}',
 '2024-04-20 20:00:00'),

-- Student2 mua Course3 - Pending
((SELECT Id FROM #IDs WHERE Name='Pay6'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 (SELECT Id FROM #IDs WHERE Name='Course3'), NULL,
 990000, 0, 990000, 'VND', 0, NULL, 0, NULL, NULL);
GO

-- ============================================================
--  8. ENROLLMENTS
-- ============================================================
INSERT INTO Enrollments (Id, UserId, CourseId, PaymentId, AccessType, EnrolledAt, CompletedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr1'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Course1'), NULL, 0,
 '2024-03-10 08:00:00', '2024-03-12 21:00:00'),

((SELECT Id FROM #IDs WHERE Name='Enr2'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 (SELECT Id FROM #IDs WHERE Name='Pay1'), 1,
 '2024-03-15 14:31:00', NULL),

((SELECT Id FROM #IDs WHERE Name='Enr3'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Course3'),
 (SELECT Id FROM #IDs WHERE Name='Pay3'), 1,
 '2024-04-01 11:01:00', NULL),

((SELECT Id FROM #IDs WHERE Name='Enr4'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 (SELECT Id FROM #IDs WHERE Name='Course1'), NULL, 0,
 '2024-03-18 10:00:00', NULL),

((SELECT Id FROM #IDs WHERE Name='Enr5'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 (SELECT Id FROM #IDs WHERE Name='Pay2'), 1,
 '2024-03-20 09:16:00', NULL),

((SELECT Id FROM #IDs WHERE Name='Enr6'),
 (SELECT Id FROM #IDs WHERE Name='Student3'),
 (SELECT Id FROM #IDs WHERE Name='Course1'), NULL, 0,
 '2024-04-05 15:00:00', NULL),

((SELECT Id FROM #IDs WHERE Name='Enr7'),
 (SELECT Id FROM #IDs WHERE Name='Student3'),
 (SELECT Id FROM #IDs WHERE Name='Course4'),
 (SELECT Id FROM #IDs WHERE Name='Pay4'), 1,
 '2024-04-10 17:16:00', NULL),

((SELECT Id FROM #IDs WHERE Name='Enr8'),
 (SELECT Id FROM #IDs WHERE Name='Student4'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 (SELECT Id FROM #IDs WHERE Name='Pay5'), 1,
 '2024-04-20 20:01:00', NULL);
GO

-- ============================================================
--  9. LESSON PROGRESS
-- ============================================================

-- Student1 - Enr1 - Course1 (Hoàn thành 4/4)
INSERT INTO LessonProgress (EnrollmentId, LessonId, IsCompleted, LastPositionSec, UpdatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr1'),(SELECT Id FROM #IDs WHERE Name='L1_1'), 1, 900,  '2024-03-10 09:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr1'),(SELECT Id FROM #IDs WHERE Name='L1_2'), 1, 1200, '2024-03-10 21:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr1'),(SELECT Id FROM #IDs WHERE Name='L1_3'), 1, 1500, '2024-03-11 20:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr1'),(SELECT Id FROM #IDs WHERE Name='L1_4'), 1, 0,    '2024-03-12 21:00:00');

-- Student1 - Enr2 - Course2 (3/5 hoàn thành, bài 4 đang xem dở)
INSERT INTO LessonProgress (EnrollmentId, LessonId, IsCompleted, LastPositionSec, UpdatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr2'),(SELECT Id FROM #IDs WHERE Name='L2_1'), 1, 1200, '2024-03-16 08:30:00'),
((SELECT Id FROM #IDs WHERE Name='Enr2'),(SELECT Id FROM #IDs WHERE Name='L2_2'), 1, 2700, '2024-03-17 21:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr2'),(SELECT Id FROM #IDs WHERE Name='L2_3'), 1, 2400, '2024-03-18 22:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr2'),(SELECT Id FROM #IDs WHERE Name='L2_4'), 0, 1350, '2024-03-19 20:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr2'),(SELECT Id FROM #IDs WHERE Name='L2_5'), 0, 0,    '2024-03-19 20:00:00');

-- Student1 - Enr3 - Course3 (1/3 hoàn thành)
INSERT INTO LessonProgress (EnrollmentId, LessonId, IsCompleted, LastPositionSec, UpdatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr3'),(SELECT Id FROM #IDs WHERE Name='L3_1'), 1, 3600, '2024-04-02 09:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr3'),(SELECT Id FROM #IDs WHERE Name='L3_2'), 0, 600,  '2024-04-03 09:30:00');

-- Student2 - Enr4 - Course1 (2/4 hoàn thành)
INSERT INTO LessonProgress (EnrollmentId, LessonId, IsCompleted, LastPositionSec, UpdatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr4'),(SELECT Id FROM #IDs WHERE Name='L1_1'), 1, 900,  '2024-03-18 11:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr4'),(SELECT Id FROM #IDs WHERE Name='L1_2'), 1, 1200, '2024-03-19 20:00:00'),
((SELECT Id FROM #IDs WHERE Name='Enr4'),(SELECT Id FROM #IDs WHERE Name='L1_3'), 0, 300,  '2024-03-20 19:00:00');

-- Student2 - Enr5 - Course2 (1/5 hoàn thành)
INSERT INTO LessonProgress (EnrollmentId, LessonId, IsCompleted, LastPositionSec, UpdatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr5'),(SELECT Id FROM #IDs WHERE Name='L2_1'), 1, 1200, '2024-03-21 09:00:00');

-- Student4 - Enr8 - Course2 (mới xem 7.5 phút bài 1)
INSERT INTO LessonProgress (EnrollmentId, LessonId, IsCompleted, LastPositionSec, UpdatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Enr8'),(SELECT Id FROM #IDs WHERE Name='L2_1'), 0, 450, '2024-04-21 08:00:00');
GO

-- ============================================================
--  10. ASSIGNMENTS
-- ============================================================
INSERT INTO Assignments (Id, CourseId, LessonId, Title, Description, Deadline, MaxAttempts, PassingScore)
VALUES
((SELECT Id FROM #IDs WHERE Name='Asgn1'),
 (SELECT Id FROM #IDs WHERE Name='Course1'), NULL,
 N'Kiểm Tra Cuối Khóa Python',
 N'Bài kiểm tra gồm 3 câu hỏi trắc nghiệm về kiến thức Python cơ bản. Cần đạt 60% để pass.',
 DATEADD(MONTH, 3, SYSUTCDATETIME()), 3, 60.00),

((SELECT Id FROM #IDs WHERE Name='Asgn2'),
 (SELECT Id FROM #IDs WHERE Name='Course2'),
 (SELECT Id FROM #IDs WHERE Name='L2_3'),
 N'Quiz: Kết Nối MongoDB với Mongoose',
 N'Kiểm tra hiểu biết về CRUD operations và schema design trong MongoDB.',
 DATEADD(MONTH, 2, SYSUTCDATETIME()), 2, 70.00),

((SELECT Id FROM #IDs WHERE Name='Asgn3'),
 (SELECT Id FROM #IDs WHERE Name='Course3'), NULL,
 N'Bài Tập: Tối Ưu Query SQL Server',
 N'Phân tích và đề xuất giải pháp tối ưu cho các query chậm cho sẵn.',
 DATEADD(DAY, 20, SYSUTCDATETIME()), 1, 75.00);
GO

-- ============================================================
--  11. QUESTIONS
-- ============================================================
INSERT INTO Questions (Id, AssignmentId, QuestionType, Content, Options, CorrectAnswer, Points, OrderIndex)
VALUES
-- Asgn1: Python
((SELECT Id FROM #IDs WHERE Name='Q1_1'),
 (SELECT Id FROM #IDs WHERE Name='Asgn1'), 0,
 N'Để in ra màn hình trong Python, ta dùng lệnh nào?',
 N'[{"key":"A","text":"console.log()"},{"key":"B","text":"print()"},{"key":"C","text":"echo()"},{"key":"D","text":"write()"}]',
 N'B', 1.00, 1),

((SELECT Id FROM #IDs WHERE Name='Q1_2'),
 (SELECT Id FROM #IDs WHERE Name='Asgn1'), 0,
 N'Kiểu dữ liệu nào dưới đây là kiểu số nguyên trong Python?',
 N'[{"key":"A","text":"float"},{"key":"B","text":"str"},{"key":"C","text":"int"},{"key":"D","text":"bool"}]',
 N'C', 1.00, 2),

((SELECT Id FROM #IDs WHERE Name='Q1_3'),
 (SELECT Id FROM #IDs WHERE Name='Asgn1'), 1,
 N'Điền vào chỗ trống: Để tạo một hàm trong Python, ta dùng từ khóa ______.',
 NULL, N'def', 1.00, 3),

-- Asgn2: MongoDB
((SELECT Id FROM #IDs WHERE Name='Q2_1'),
 (SELECT Id FROM #IDs WHERE Name='Asgn2'), 0,
 N'Phương thức nào trong Mongoose dùng để tìm tất cả documents?',
 N'[{"key":"A","text":"Model.findOne()"},{"key":"B","text":"Model.find()"},{"key":"C","text":"Model.findAll()"},{"key":"D","text":"Model.search()"}]',
 N'B', 1.00, 1),

((SELECT Id FROM #IDs WHERE Name='Q2_2'),
 (SELECT Id FROM #IDs WHERE Name='Asgn2'), 0,
 N'Trong Mongoose Schema, kiểu dữ liệu nào tương đương với chuỗi ký tự?',
 N'[{"key":"A","text":"Number"},{"key":"B","text":"Boolean"},{"key":"C","text":"String"},{"key":"D","text":"Buffer"}]',
 N'C', 1.00, 2),

-- Asgn3: SQL
((SELECT Id FROM #IDs WHERE Name='Q3_1'),
 (SELECT Id FROM #IDs WHERE Name='Asgn3'), 0,
 N'Index nào phù hợp nhất để tăng tốc truy vấn tìm kiếm theo khoảng giá trị (range query)?',
 N'[{"key":"A","text":"Full-text index"},{"key":"B","text":"Clustered index"},{"key":"C","text":"Non-clustered index"},{"key":"D","text":"XML index"}]',
 N'B', 2.00, 1),

((SELECT Id FROM #IDs WHERE Name='Q3_2'),
 (SELECT Id FROM #IDs WHERE Name='Asgn3'), 1,
 N'Điền vào chỗ trống: Câu lệnh ______ dùng để xem kế hoạch thực thi của một query trong SQL Server.',
 NULL, N'SET STATISTICS IO ON', 2.00, 2);
GO

-- ============================================================
--  12. SUBMISSIONS
--  Answers JSON dùng ID thực từ #IDs
-- ============================================================
DECLARE
    @q1_1 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q1_1') AS NVARCHAR(36)),
    @q1_2 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q1_2') AS NVARCHAR(36)),
    @q1_3 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q1_3') AS NVARCHAR(36)),
    @q2_1 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q2_1') AS NVARCHAR(36)),
    @q2_2 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q2_2') AS NVARCHAR(36)),
    @q3_1 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q3_1') AS NVARCHAR(36)),
    @q3_2 NVARCHAR(36) = CAST((SELECT Id FROM #IDs WHERE Name='Q3_2') AS NVARCHAR(36));

INSERT INTO Submissions (AssignmentId, UserId, Answers, Score, IsPassed, AttemptNumber, SubmittedAt)
VALUES
-- Student1 làm Asgn1 (Python) - đúng hết, lần 1
((SELECT Id FROM #IDs WHERE Name='Asgn1'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 CONCAT(N'{"',@q1_1,N'":"B","',@q1_2,N'":"C","',@q1_3,N'":"def"}'),
 100.00, 1, 1, '2024-03-12 21:30:00'),

-- Student2 làm Asgn1 lần 1 - sai câu 1 và 3
((SELECT Id FROM #IDs WHERE Name='Asgn1'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 CONCAT(N'{"',@q1_1,N'":"A","',@q1_2,N'":"C","',@q1_3,N'":"function"}'),
 33.33, 0, 1, '2024-03-25 20:00:00'),

-- Student2 làm Asgn1 lần 2 - đúng hết
((SELECT Id FROM #IDs WHERE Name='Asgn1'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 CONCAT(N'{"',@q1_1,N'":"B","',@q1_2,N'":"C","',@q1_3,N'":"def"}'),
 100.00, 1, 2, '2024-03-26 19:00:00'),

-- Student1 làm Asgn2 (Fullstack)
((SELECT Id FROM #IDs WHERE Name='Asgn2'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 CONCAT(N'{"',@q2_1,N'":"B","',@q2_2,N'":"C"}'),
 100.00, 1, 1, '2024-03-22 10:00:00'),

-- Student1 làm Asgn3 (SQL)
((SELECT Id FROM #IDs WHERE Name='Asgn3'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 CONCAT(N'{"',@q3_1,N'":"B","',@q3_2,N'":"SET STATISTICS IO ON"}'),
 100.00, 1, 1, '2024-04-03 14:00:00');
GO

-- ============================================================
--  13. CERTIFICATES
-- ============================================================
INSERT INTO Certificates (Id, UserId, CourseId, VerifyCode, IssuedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Cert1'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Course1'),
 'CERT-PY24-LAN-A8F3B2C1D9E7',
 '2024-03-12 21:01:00');
GO

-- ============================================================
--  14. COMMENTS
-- ============================================================
INSERT INTO Comments (Id, LessonId, UserId, ParentId, Content, Upvotes, CreatedAt, UpdatedAt)
VALUES
-- Comment gốc bài 1 - Course1
((SELECT Id FROM #IDs WHERE Name='Cmt1'),
 (SELECT Id FROM #IDs WHERE Name='L1_1'),
 (SELECT Id FROM #IDs WHERE Name='Student1'), NULL,
 N'Bài giảng rất dễ hiểu! Video chất lượng tốt, thầy giải thích từng bước rõ ràng. Mình đã cài Python thành công theo hướng dẫn.',
 12, '2024-03-10 09:05:00', '2024-03-10 09:05:00'),

-- Reply của Student2
((SELECT Id FROM #IDs WHERE Name='Cmt2'),
 (SELECT Id FROM #IDs WHERE Name='L1_1'),
 (SELECT Id FROM #IDs WHERE Name='Student2'),
 (SELECT Id FROM #IDs WHERE Name='Cmt1'),
 N'Đồng ý! Mình cũng thấy vậy. Bạn đã làm bài tập cuối chưa?',
 3, '2024-03-18 11:10:00', '2024-03-18 11:10:00'),

-- Reply của Student1 tiếp
((SELECT Id FROM #IDs WHERE Name='Cmt3'),
 (SELECT Id FROM #IDs WHERE Name='L1_1'),
 (SELECT Id FROM #IDs WHERE Name='Student1'),
 (SELECT Id FROM #IDs WHERE Name='Cmt1'),
 N'Rồi bạn ơi, bài tập khá dễ, thử làm xem nhé!',
 5, '2024-03-18 11:30:00', '2024-03-18 11:30:00'),

-- Comment bài 2 Course2
((SELECT Id FROM #IDs WHERE Name='Cmt4'),
 (SELECT Id FROM #IDs WHERE Name='L2_2'),
 (SELECT Id FROM #IDs WHERE Name='Student1'), NULL,
 N'Phần middleware trong Express rất hay, nhưng mình chưa hiểu tại sao cần dùng next(). Thầy có thể giải thích thêm không ạ?',
 8, '2024-03-17 21:30:00', '2024-03-17 21:30:00'),

-- Admin reply
((SELECT Id FROM #IDs WHERE Name='Cmt5'),
 (SELECT Id FROM #IDs WHERE Name='L2_2'),
 (SELECT Id FROM #IDs WHERE Name='Admin'),
 (SELECT Id FROM #IDs WHERE Name='Cmt4'),
 N'Chào bạn! Hàm next() dùng để chuyển control sang middleware tiếp theo trong chuỗi. Nếu không gọi next(), request sẽ bị "treo" và không đến được route handler. Bài 3 mình sẽ demo chi tiết hơn nhé!',
 15, '2024-03-18 08:00:00', '2024-03-18 08:00:00');
GO

-- ============================================================
--  15. NOTIFICATIONS
-- ============================================================
INSERT INTO Notifications (UserId, Title, Body, NotifType, RelatedId, IsRead, CreatedAt)
VALUES
((SELECT Id FROM #IDs WHERE Name='Student1'),
 N'Đăng ký khóa học thành công!',
 N'Bạn đã được cấp quyền truy cập khóa học "Lập Trình Web Fullstack". Bắt đầu học ngay nhé!',
 2, (SELECT Id FROM #IDs WHERE Name='Course2'), 1, '2024-03-15 14:31:00'),

((SELECT Id FROM #IDs WHERE Name='Student1'),
 N'Đăng ký khóa học thành công!',
 N'Bạn đã được cấp quyền truy cập khóa học "SQL Server Nâng Cao". Bắt đầu học ngay nhé!',
 2, (SELECT Id FROM #IDs WHERE Name='Course3'), 1, '2024-04-01 11:01:00'),

((SELECT Id FROM #IDs WHERE Name='Student1'),
 N'Chúc mừng! Bạn đã hoàn thành khóa học.',
 N'Chứng chỉ của bạn cho khóa "Python Cơ Bản" đã được cấp. Hãy tải về và chia sẻ thành tích!',
 4, (SELECT Id FROM #IDs WHERE Name='Course1'), 1, '2024-03-12 21:01:00'),

((SELECT Id FROM #IDs WHERE Name='Student1'),
 N'Bài tập mới: SQL Server Query Optimization',
 N'Admin vừa thêm bài tập "Bài Tập: Tối Ưu Query SQL Server" vào khóa học. Hạn nộp: 20 ngày nữa.',
 0, (SELECT Id FROM #IDs WHERE Name='Asgn3'), 1, '2024-04-01 11:30:00'),

((SELECT Id FROM #IDs WHERE Name='Student2'),
 N'Đăng ký khóa học thành công!',
 N'Bạn đã được cấp quyền truy cập khóa học "Lập Trình Web Fullstack". Bắt đầu học ngay nhé!',
 2, (SELECT Id FROM #IDs WHERE Name='Course2'), 1, '2024-03-20 09:16:00'),

((SELECT Id FROM #IDs WHERE Name='Student2'),
 N'Có người reply comment của bạn!',
 N'Trần Thị Lan đã trả lời bình luận của bạn trong bài "Giới Thiệu Python & Cài Đặt Môi Trường".',
 3, (SELECT Id FROM #IDs WHERE Name='L1_1'), 0, '2024-03-18 11:30:00'),

((SELECT Id FROM #IDs WHERE Name='Student2'),
 N'Nhắc nhở: Bài tập sắp đến hạn',
 N'Bài tập "Kiểm Tra Cuối Khóa Python" sẽ hết hạn trong vòng 24 giờ.',
 1, (SELECT Id FROM #IDs WHERE Name='Asgn1'), 0, DATEADD(DAY, -1, DATEADD(MONTH, 3, SYSUTCDATETIME()))),

((SELECT Id FROM #IDs WHERE Name='Student3'),
 N'Đăng ký khóa học thành công!',
 N'Bạn đã được cấp quyền truy cập khóa học "Phát Triển App Mobile với React Native". Bắt đầu học ngay nhé!',
 2, (SELECT Id FROM #IDs WHERE Name='Course4'), 0, '2024-04-10 17:16:00'),

((SELECT Id FROM #IDs WHERE Name='Student4'),
 N'Đăng ký khóa học thành công!',
 N'Bạn đã được cấp quyền truy cập khóa học "Lập Trình Web Fullstack". Bắt đầu học ngay nhé!',
 2, (SELECT Id FROM #IDs WHERE Name='Course2'), 0, '2024-04-20 20:01:00');
GO

-- ============================================================
--  16. NOTIFICATION PREFERENCES
-- ============================================================
INSERT INTO NotificationPreferences (UserId, NewAssignment, DeadlineReminder, CommentReply, CourseComplete, EmailEnabled)
VALUES
((SELECT Id FROM #IDs WHERE Name='Student1'), 1, 1, 1, 1, 1),
((SELECT Id FROM #IDs WHERE Name='Student2'), 1, 1, 0, 1, 1),
((SELECT Id FROM #IDs WHERE Name='Student3'), 0, 1, 1, 1, 0),
((SELECT Id FROM #IDs WHERE Name='Student4'), 1, 0, 1, 1, 1),
((SELECT Id FROM #IDs WHERE Name='Admin'),    0, 0, 0, 0, 1);
GO

-- ============================================================
--  DỌN DẸP BẢNG TẠM
-- ============================================================
DROP TABLE #IDs;
GO

-- ============================================================
--  KIỂM TRA KẾT QUẢ
-- ============================================================
PRINT '=== THỐNG KÊ DỮ LIỆU ĐÃ CHÈN ===';
SELECT 'Users'                   AS TableName, COUNT(*) AS [RowCount] FROM Users        UNION ALL
SELECT 'Courses',                              COUNT(*)             FROM Courses       UNION ALL
SELECT 'Lessons',                              COUNT(*)             FROM Lessons       UNION ALL
SELECT 'Coupons',                              COUNT(*)             FROM Coupons       UNION ALL
SELECT 'Payments',                             COUNT(*)             FROM Payments      UNION ALL
SELECT 'Enrollments',                          COUNT(*)             FROM Enrollments   UNION ALL
SELECT 'LessonProgress',                       COUNT(*)             FROM LessonProgress UNION ALL
SELECT 'Assignments',                          COUNT(*)             FROM Assignments   UNION ALL
SELECT 'Questions',                            COUNT(*)             FROM Questions     UNION ALL
SELECT 'Submissions',                          COUNT(*)             FROM Submissions   UNION ALL
SELECT 'Certificates',                         COUNT(*)             FROM Certificates  UNION ALL
SELECT 'Comments',                             COUNT(*)             FROM Comments      UNION ALL
SELECT 'Notifications',                        COUNT(*)             FROM Notifications UNION ALL
SELECT 'NotificationPreferences',              COUNT(*)             FROM NotificationPreferences;

PRINT '';
PRINT '=== TIẾN ĐỘ HỌC THEO VIEW ===';
SELECT u.FullName, c.Title AS CourseName,
       ep.TotalLessons, ep.CompletedLessons, ep.ProgressPercent
FROM vw_EnrollmentProgress ep
JOIN Users   u ON u.Id = ep.UserId
JOIN Courses c ON c.Id = ep.CourseId
ORDER BY u.FullName, c.Title;

PRINT '';
PRINT '=== BẢNG ĐIỂM BÀI TẬP ===';
SELECT AssignmentTitle, FullName, Score, IsPassed, AttemptNumber, SubmittedAt
FROM vw_AssignmentScoreBoard
ORDER BY AssignmentTitle, SubmittedAt;
GO
