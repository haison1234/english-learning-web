-- ============================================================
--  E-LEARNING DATABASE  |  SQL Server
--  Dựa theo ERD + User Stories + Luồng nghiệp vụ
-- ============================================================

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'ELearningDB')
    DROP DATABASE ELearningDB;
GO

CREATE DATABASE ELearningDB
    COLLATE Vietnamese_CI_AS;
GO

USE ELearningDB;
GO

-- ============================================================
--  1. USERS
-- ============================================================
CREATE TABLE Users (
    Id            UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWSEQUENTIALID(),
    FullName      NVARCHAR(150)       NOT NULL,
    Email         NVARCHAR(255)       NOT NULL,
    PasswordHash  NVARCHAR(512)       NULL,          -- NULL nếu đăng nhập OAuth
    AvatarUrl     NVARCHAR(500)       NULL,
    Role          TINYINT             NOT NULL        -- 0=Guest(chỉ đọc), 1=Student, 2=Admin
        CONSTRAINT CK_Users_Role CHECK (Role IN (0, 1, 2)),
    Status        TINYINT             NOT NULL DEFAULT 1  -- 0=Inactive, 1=Active
        CONSTRAINT CK_Users_Status CHECK (Status IN (0, 1)),
    EmailVerified BIT                 NOT NULL DEFAULT 0,
    OAuthProvider NVARCHAR(50)        NULL,          -- 'google', NULL nếu email/pass
    OAuthId       NVARCHAR(255)       NULL,
    CreatedAt     DATETIME2(0)        NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2(0)        NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Users PRIMARY KEY (Id),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);

CREATE INDEX IX_Users_Role   ON Users (Role);
CREATE INDEX IX_Users_Status ON Users (Status);
GO

-- ============================================================
--  2. EMAIL VERIFICATION TOKENS  (US-G03)
-- ============================================================
CREATE TABLE EmailVerificationTokens (
    Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId    UNIQUEIDENTIFIER NOT NULL,
    Token     NVARCHAR(512)    NOT NULL,
    ExpiresAt DATETIME2(0)     NOT NULL,
    UsedAt    DATETIME2(0)     NULL,

    CONSTRAINT PK_EmailVerificationTokens PRIMARY KEY (Id),
    CONSTRAINT FK_EVT_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
--  3. PASSWORD RESET TOKENS  (US-G04)
-- ============================================================
CREATE TABLE PasswordResetTokens (
    Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId    UNIQUEIDENTIFIER NOT NULL,
    Token     NVARCHAR(512)    NOT NULL,
    ExpiresAt DATETIME2(0)     NOT NULL,
    UsedAt    DATETIME2(0)     NULL,

    CONSTRAINT PK_PasswordResetTokens PRIMARY KEY (Id),
    CONSTRAINT FK_PRT_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
--  4. COURSES  (US-A01)
-- ============================================================
CREATE TABLE Courses (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Title        NVARCHAR(300)    NOT NULL,
    Description  NVARCHAR(MAX)    NULL,
    Level        TINYINT          NOT NULL  -- 0=Beginner, 1=Intermediate, 2=Advanced
        CONSTRAINT CK_Courses_Level CHECK (Level IN (0, 1, 2)),
    CourseType   TINYINT          NOT NULL DEFAULT 0  -- 0=Free, 1=Paid
        CONSTRAINT CK_Courses_CourseType CHECK (CourseType IN (0, 1)),
    BasePrice    DECIMAL(12,0)    NOT NULL DEFAULT 0, -- VND, 0 nếu free
    ThumbnailUrl NVARCHAR(500)    NULL,
    TrailerUrl   NVARCHAR(500)    NULL,               -- Preview video không cần login
    Status       TINYINT          NOT NULL DEFAULT 0  -- 0=Draft, 1=Published, 2=Archived
        CONSTRAINT CK_Courses_Status CHECK (Status IN (0, 1, 2)),
    CreatedBy    UNIQUEIDENTIFIER NOT NULL,
    CreatedAt    DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Courses PRIMARY KEY (Id),
    CONSTRAINT FK_Courses_Users FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_Courses_Status     ON Courses (Status);
CREATE INDEX IX_Courses_CourseType ON Courses (CourseType);
CREATE INDEX IX_Courses_Level      ON Courses (Level);
GO

-- ============================================================
--  5. LESSONS  (US-A03)
-- ============================================================
CREATE TABLE Lessons (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    CourseId        UNIQUEIDENTIFIER NOT NULL,
    Title           NVARCHAR(300)    NOT NULL,
    ContentType     TINYINT          NOT NULL  -- 0=Video, 1=Audio, 2=Text, 3=PDF
        CONSTRAINT CK_Lessons_ContentType CHECK (ContentType IN (0, 1, 2, 3)),
    ContentUrl      NVARCHAR(500)    NULL,
    TextContent     NVARCHAR(MAX)    NULL,      -- dùng khi ContentType=2
    DurationSeconds INT              NOT NULL DEFAULT 0,
    OrderIndex      INT              NOT NULL DEFAULT 0,
    IsPreview       BIT              NOT NULL DEFAULT 0,  -- 1=guest xem được
    CreatedAt       DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Lessons PRIMARY KEY (Id),
    CONSTRAINT FK_Lessons_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Lessons_CourseId    ON Lessons (CourseId);
CREATE INDEX IX_Lessons_OrderIndex  ON Lessons (CourseId, OrderIndex);
GO

-- ============================================================
--  6. COUPONS  (US-A07)
-- ============================================================
CREATE TABLE Coupons (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Code          NVARCHAR(50)     NOT NULL,
    DiscountType  TINYINT          NOT NULL  -- 0=Percentage, 1=FixedAmount
        CONSTRAINT CK_Coupons_DiscountType CHECK (DiscountType IN (0, 1)),
    DiscountValue DECIMAL(12,2)    NOT NULL
        CONSTRAINT CK_Coupons_DiscountValue CHECK (DiscountValue > 0),
    MaxUses       INT              NOT NULL DEFAULT 1,
    UsedCount     INT              NOT NULL DEFAULT 0,
    ExpiresAt     DATETIME2(0)     NOT NULL,
    CreatedBy     UNIQUEIDENTIFIER NOT NULL,
    CreatedAt     DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Coupons PRIMARY KEY (Id),
    CONSTRAINT UQ_Coupons_Code UNIQUE (Code),
    CONSTRAINT FK_Coupons_Users FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);
GO

-- ============================================================
--  7. PAYMENTS  (US-S01 + luồng thanh toán)
-- ============================================================
CREATE TABLE Payments (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId          UNIQUEIDENTIFIER NOT NULL,
    CourseId        UNIQUEIDENTIFIER NOT NULL,
    CouponId        UNIQUEIDENTIFIER NULL,
    OriginalPrice   DECIMAL(12,0)    NOT NULL,   -- Giá gốc lúc mua (không đổi dù admin sửa sau)
    DiscountAmount  DECIMAL(12,0)    NOT NULL DEFAULT 0,
    FinalPrice      DECIMAL(12,0)    NOT NULL,   -- Số tiền thực thu
    Currency        NCHAR(3)         NOT NULL DEFAULT 'VND',
    Method          TINYINT          NOT NULL    -- 0=VNPay, 1=Momo, 2=BankCard, 3=Free
        CONSTRAINT CK_Payments_Method CHECK (Method IN (0, 1, 2, 3)),
    TransactionRef  NVARCHAR(255)    NULL,       -- Mã giao dịch từ cổng thanh toán
    Status          TINYINT          NOT NULL DEFAULT 0  -- 0=Pending, 1=Success, 2=Failed, 3=Refunded
        CONSTRAINT CK_Payments_Status CHECK (Status IN (0, 1, 2, 3)),
    GatewayResponse NVARCHAR(MAX)    NULL,       -- Raw JSON từ cổng (để đối soát)
    PaidAt          DATETIME2(0)     NULL,
    CreatedAt       DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Payments PRIMARY KEY (Id),
    CONSTRAINT FK_Payments_Users   FOREIGN KEY (UserId)   REFERENCES Users(Id),
    CONSTRAINT FK_Payments_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id),
    CONSTRAINT FK_Payments_Coupons FOREIGN KEY (CouponId) REFERENCES Coupons(Id)
);

CREATE INDEX IX_Payments_UserId   ON Payments (UserId);
CREATE INDEX IX_Payments_CourseId ON Payments (CourseId);
CREATE INDEX IX_Payments_Status   ON Payments (Status);
GO

-- ============================================================
--  8. ENROLLMENTS  (US-S01)
-- ============================================================
CREATE TABLE Enrollments (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId       UNIQUEIDENTIFIER NOT NULL,
    CourseId     UNIQUEIDENTIFIER NOT NULL,
    PaymentId    UNIQUEIDENTIFIER NULL,    -- NULL nếu khóa free
    AccessType   TINYINT          NOT NULL DEFAULT 0  -- 0=Free, 1=Paid
        CONSTRAINT CK_Enrollments_AccessType CHECK (AccessType IN (0, 1)),
    EnrolledAt   DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),
    CompletedAt  DATETIME2(0)     NULL,

    CONSTRAINT PK_Enrollments PRIMARY KEY (Id),
    CONSTRAINT UQ_Enrollments_User_Course UNIQUE (UserId, CourseId),
    CONSTRAINT FK_Enrollments_Users    FOREIGN KEY (UserId)    REFERENCES Users(Id),
    CONSTRAINT FK_Enrollments_Courses  FOREIGN KEY (CourseId)  REFERENCES Courses(Id),
    CONSTRAINT FK_Enrollments_Payments FOREIGN KEY (PaymentId) REFERENCES Payments(Id)
);

CREATE INDEX IX_Enrollments_UserId   ON Enrollments (UserId);
CREATE INDEX IX_Enrollments_CourseId ON Enrollments (CourseId);
GO

-- ============================================================
--  9. LESSON PROGRESS  (US-S02, US-S04)
-- ============================================================
CREATE TABLE LessonProgress (
    Id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    EnrollmentId    UNIQUEIDENTIFIER NOT NULL,
    LessonId        UNIQUEIDENTIFIER NOT NULL,
    IsCompleted     BIT              NOT NULL DEFAULT 0,
    LastPositionSec INT              NOT NULL DEFAULT 0,  -- Ghi nhớ vị trí video
    UpdatedAt       DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_LessonProgress PRIMARY KEY (Id),
    CONSTRAINT UQ_LessonProgress_Enrollment_Lesson UNIQUE (EnrollmentId, LessonId),
    CONSTRAINT FK_LP_Enrollments FOREIGN KEY (EnrollmentId) REFERENCES Enrollments(Id) ON DELETE CASCADE,
    CONSTRAINT FK_LP_Lessons     FOREIGN KEY (LessonId)     REFERENCES Lessons(Id)
);

CREATE INDEX IX_LessonProgress_EnrollmentId ON LessonProgress (EnrollmentId);
GO

-- ============================================================
--  10. ASSIGNMENTS  (US-A02)
-- ============================================================
CREATE TABLE Assignments (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    CourseId     UNIQUEIDENTIFIER NOT NULL,
    LessonId     UNIQUEIDENTIFIER NULL,   -- NULL = gắn vào cả khóa học
    Title        NVARCHAR(300)    NOT NULL,
    Description  NVARCHAR(MAX)    NULL,
    Deadline     DATETIME2(0)     NULL,
    MaxAttempts  INT              NOT NULL DEFAULT 1,
    PassingScore DECIMAL(5,2)     NOT NULL DEFAULT 50.00,
    CreatedAt    DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Assignments PRIMARY KEY (Id),
    CONSTRAINT FK_Assignments_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Assignments_Lessons FOREIGN KEY (LessonId) REFERENCES Lessons(Id)
);

CREATE INDEX IX_Assignments_CourseId ON Assignments (CourseId);
GO

-- ============================================================
--  11. QUESTIONS  (US-A02)
-- ============================================================
CREATE TABLE Questions (
    Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    AssignmentId  UNIQUEIDENTIFIER NOT NULL,
    QuestionType  TINYINT          NOT NULL  -- 0=MultipleChoice, 1=FillBlank, 2=Matching
        CONSTRAINT CK_Questions_Type CHECK (QuestionType IN (0, 1, 2)),
    Content       NVARCHAR(MAX)    NOT NULL,
    Options       NVARCHAR(MAX)    NULL,     -- JSON: [{"key":"A","text":"..."}]
    CorrectAnswer NVARCHAR(MAX)    NOT NULL, -- JSON hoặc plain text tuỳ loại câu
    Points        DECIMAL(5,2)     NOT NULL DEFAULT 1.00,
    OrderIndex    INT              NOT NULL DEFAULT 0,

    CONSTRAINT PK_Questions PRIMARY KEY (Id),
    CONSTRAINT FK_Questions_Assignments FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Questions_AssignmentId ON Questions (AssignmentId);
GO

-- ============================================================
--  12. SUBMISSIONS  (US-S03)
-- ============================================================
CREATE TABLE Submissions (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    AssignmentId   UNIQUEIDENTIFIER NOT NULL,
    UserId         UNIQUEIDENTIFIER NOT NULL,
    Answers        NVARCHAR(MAX)    NOT NULL, -- JSON: {"questionId": "answer"}
    Score          DECIMAL(5,2)     NULL,
    IsPassed       BIT              NULL,
    AttemptNumber  INT              NOT NULL DEFAULT 1,
    SubmittedAt    DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Submissions PRIMARY KEY (Id),
    CONSTRAINT FK_Submissions_Assignments FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id),
    CONSTRAINT FK_Submissions_Users       FOREIGN KEY (UserId)       REFERENCES Users(Id)
);

CREATE INDEX IX_Submissions_AssignmentId ON Submissions (AssignmentId);
CREATE INDEX IX_Submissions_UserId       ON Submissions (UserId);
GO

-- ============================================================
--  13. CERTIFICATES  (US-S06)
-- ============================================================
CREATE TABLE Certificates (
    Id          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    CourseId    UNIQUEIDENTIFIER NOT NULL,
    VerifyCode  NVARCHAR(100)    NOT NULL,  -- Mã xác thực duy nhất
    IssuedAt    DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Certificates PRIMARY KEY (Id),
    CONSTRAINT UQ_Certificates_User_Course UNIQUE (UserId, CourseId),
    CONSTRAINT UQ_Certificates_VerifyCode  UNIQUE (VerifyCode),
    CONSTRAINT FK_Certificates_Users   FOREIGN KEY (UserId)   REFERENCES Users(Id),
    CONSTRAINT FK_Certificates_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id)
);
GO

-- ============================================================
--  14. COMMENTS  (US-S07)
-- ============================================================
CREATE TABLE Comments (
    Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    LessonId  UNIQUEIDENTIFIER NOT NULL,
    UserId    UNIQUEIDENTIFIER NOT NULL,
    ParentId  UNIQUEIDENTIFIER NULL,   -- NULL = comment gốc, có giá trị = reply
    Content   NVARCHAR(MAX)    NOT NULL,
    Upvotes   INT              NOT NULL DEFAULT 0,
    CreatedAt DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Comments PRIMARY KEY (Id),
    CONSTRAINT FK_Comments_Lessons  FOREIGN KEY (LessonId) REFERENCES Lessons(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_Users    FOREIGN KEY (UserId)   REFERENCES Users(Id),
    CONSTRAINT FK_Comments_Parent   FOREIGN KEY (ParentId) REFERENCES Comments(Id)
);

CREATE INDEX IX_Comments_LessonId ON Comments (LessonId);
CREATE INDEX IX_Comments_ParentId ON Comments (ParentId);
GO

-- ============================================================
--  15. NOTIFICATIONS  (US-S05, US-A06)
-- ============================================================
CREATE TABLE Notifications (
    Id          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    UserId      UNIQUEIDENTIFIER NOT NULL,
    Title       NVARCHAR(200)    NOT NULL,
    Body        NVARCHAR(MAX)    NOT NULL,
    NotifType   TINYINT          NOT NULL  -- 0=NewAssignment, 1=Deadline, 2=EnrollSuccess, 3=CommentReply, 4=CourseComplete, 5=AdminBroadcast
        CONSTRAINT CK_Notifications_Type CHECK (NotifType IN (0, 1, 2, 3, 4, 5)),
    RelatedId   UNIQUEIDENTIFIER NULL,     -- Id của Assignment / Course / Comment liên quan
    IsRead      BIT              NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_Notifications PRIMARY KEY (Id),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Notifications_UserId ON Notifications (UserId);
CREATE INDEX IX_Notifications_IsRead ON Notifications (UserId, IsRead);
GO

-- ============================================================
--  16. NOTIFICATION PREFERENCES  (US-S05 - tắt/bật loại thông báo)
-- ============================================================
CREATE TABLE NotificationPreferences (
    UserId            UNIQUEIDENTIFIER NOT NULL,
    NewAssignment     BIT NOT NULL DEFAULT 1,
    DeadlineReminder  BIT NOT NULL DEFAULT 1,
    CommentReply      BIT NOT NULL DEFAULT 1,
    CourseComplete    BIT NOT NULL DEFAULT 1,
    EmailEnabled      BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_NotifPrefs PRIMARY KEY (UserId),
    CONSTRAINT FK_NotifPrefs_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- ============================================================
--  VIEWS TIỆN ÍCH
-- ============================================================

-- V1: Tiến độ tổng hợp mỗi enrollment
CREATE VIEW vw_EnrollmentProgress AS
SELECT
    e.Id            AS EnrollmentId,
    e.UserId,
    e.CourseId,
    COUNT(l.Id)     AS TotalLessons,
    SUM(CASE WHEN lp.IsCompleted = 1 THEN 1 ELSE 0 END) AS CompletedLessons,
    CASE
        WHEN COUNT(l.Id) = 0 THEN 0
        ELSE CAST(SUM(CASE WHEN lp.IsCompleted = 1 THEN 1 ELSE 0 END) * 100.0
                  / COUNT(l.Id) AS DECIMAL(5,2))
    END             AS ProgressPercent
FROM Enrollments e
JOIN Lessons l ON l.CourseId = e.CourseId
LEFT JOIN LessonProgress lp
    ON lp.EnrollmentId = e.Id AND lp.LessonId = l.Id
GROUP BY e.Id, e.UserId, e.CourseId;
GO

-- V2: Bảng điểm học sinh theo bài tập
CREATE VIEW vw_AssignmentScoreBoard AS
SELECT
    s.AssignmentId,
    a.Title         AS AssignmentTitle,
    s.UserId,
    u.FullName,
    u.Email,
    s.Score,
    s.IsPassed,
    s.AttemptNumber,
    s.SubmittedAt
FROM Submissions s
JOIN Users       u ON u.Id = s.UserId
JOIN Assignments a ON a.Id = s.AssignmentId;
GO

-- ============================================================
--  STORED PROCEDURES CHÍNH
-- ============================================================

-- SP1: Tự động tạo Enrollment sau khi Payment thành công
CREATE OR ALTER PROCEDURE sp_ActivateEnrollment
    @PaymentId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UserId   UNIQUEIDENTIFIER,
            @CourseId UNIQUEIDENTIFIER,
            @Status   TINYINT;

    SELECT @UserId   = UserId,
           @CourseId = CourseId,
           @Status   = Status
    FROM Payments WHERE Id = @PaymentId;

    IF @Status <> 1  -- Chỉ kích hoạt khi Success
        RETURN;

    IF NOT EXISTS (SELECT 1 FROM Enrollments WHERE UserId = @UserId AND CourseId = @CourseId)
    BEGIN
        INSERT INTO Enrollments (UserId, CourseId, PaymentId, AccessType)
        VALUES (@UserId, @CourseId, @PaymentId, 1);

        -- Thông báo đăng ký thành công
        INSERT INTO Notifications (UserId, Title, Body, NotifType, RelatedId)
        VALUES (@UserId,
                N'Đăng ký khóa học thành công!',
                N'Bạn đã được cấp quyền truy cập khóa học. Bắt đầu học ngay nhé!',
                2, @CourseId);
    END
END;
GO

-- SP2: Cấp chứng chỉ khi hoàn thành 100%
CREATE OR ALTER PROCEDURE sp_IssueCertificateIfComplete
    @EnrollmentId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UserId         UNIQUEIDENTIFIER,
            @CourseId       UNIQUEIDENTIFIER,
            @TotalLessons   INT,
            @CompletedCount INT;

    SELECT @UserId   = UserId,
           @CourseId = CourseId
    FROM Enrollments WHERE Id = @EnrollmentId;

    SELECT @TotalLessons   = TotalLessons,
           @CompletedCount = CompletedLessons
    FROM vw_EnrollmentProgress WHERE EnrollmentId = @EnrollmentId;

    IF @TotalLessons > 0 AND @TotalLessons = @CompletedCount
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Certificates WHERE UserId = @UserId AND CourseId = @CourseId)
        BEGIN
            DECLARE @Code NVARCHAR(100) = UPPER(LEFT(REPLACE(CAST(NEWID() AS NVARCHAR(36)),'-',''), 16));

            INSERT INTO Certificates (UserId, CourseId, VerifyCode)
            VALUES (@UserId, @CourseId, @Code);

            -- Cập nhật CompletedAt trên Enrollment
            UPDATE Enrollments SET CompletedAt = SYSUTCDATETIME()
            WHERE Id = @EnrollmentId;

            -- Thông báo hoàn thành
            INSERT INTO Notifications (UserId, Title, Body, NotifType, RelatedId)
            VALUES (@UserId,
                    N'Chúc mừng! Bạn đã hoàn thành khóa học.',
                    N'Chứng chỉ của bạn đã được cấp. Hãy tải về và chia sẻ thành tích!',
                    4, @CourseId);
        END
    END
END;
GO

-- SP3: Nhắc deadline bài tập (chạy bằng SQL Agent Job mỗi giờ)
CREATE OR ALTER PROCEDURE sp_SendDeadlineReminders
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Notifications (UserId, Title, Body, NotifType, RelatedId)
    SELECT DISTINCT
        e.UserId,
        N'Nhắc nhở: Bài tập sắp đến hạn',
        CONCAT(N'Bài tập "', a.Title, N'" sẽ hết hạn trong vòng 24 giờ.'),
        1,
        a.Id
    FROM Assignments a
    JOIN Enrollments e ON e.CourseId = a.CourseId
    WHERE a.Deadline IS NOT NULL
      AND a.Deadline BETWEEN SYSUTCDATETIME() AND DATEADD(HOUR, 24, SYSUTCDATETIME())
      -- Không gửi lại nếu đã gửi thông báo loại này hôm nay
      AND NOT EXISTS (
          SELECT 1 FROM Notifications n
          WHERE n.UserId    = e.UserId
            AND n.RelatedId = a.Id
            AND n.NotifType = 1
            AND n.CreatedAt >= CAST(GETUTCDATE() AS DATE)
      );
END;
GO

