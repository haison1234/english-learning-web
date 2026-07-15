-- ============================================================
-- V5: SEED MORE COURSES (INTERMEDIATE, ADVANCED)
-- ============================================================

-- Intermediate Course
IF NOT EXISTS (SELECT 1 FROM Courses WHERE Title = N'IELTS 6.5 Foundation')
BEGIN
    DECLARE @InterCourseId UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO Courses (Id, Title, Level, Price, Status, Metadata, CreatedAt)
    VALUES (@InterCourseId, N'IELTS 6.5 Foundation', 1, 499000, 1, 
            N'{"description":"Lộ trình trung cấp giúp bạn đạt IELTS 6.5 dễ dàng, tập trung vào cả 4 kỹ năng Nghe, Nói, Đọc, Viết.","thumbnailUrl":"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80","trailerUrl":""}', 
            SYSUTCDATETIME());

    -- Lesson 1 (Video)
    INSERT INTO Lessons (Id, CourseId, Title, IsPreview, OrderIndex, Type, Content)
    VALUES (NEWID(), @InterCourseId, N'Listening Strategy: Multiple Choice', 1, 1, 0, 
            N'{"contentUrl":"https://www.youtube.com/embed/dQw4w9WgXcQ","durationSeconds":1200}');
END

-- Advanced Course
IF NOT EXISTS (SELECT 1 FROM Courses WHERE Title = N'IELTS 8.0 Mastery')
BEGIN
    DECLARE @AdvCourseId UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO Courses (Id, Title, Level, Price, Status, Metadata, CreatedAt)
    VALUES (@AdvCourseId, N'IELTS 8.0 Mastery', 2, 999000, 1, 
            N'{"description":"Khóa học nâng cao dành cho các bạn muốn chinh phục điểm số tuyệt đối IELTS 8.0+.","thumbnailUrl":"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80","trailerUrl":""}', 
            SYSUTCDATETIME());

    -- Lesson 1 (Video)
    INSERT INTO Lessons (Id, CourseId, Title, IsPreview, OrderIndex, Type, Content)
    VALUES (NEWID(), @AdvCourseId, N'Advanced Writing: Task 2 Structures', 1, 1, 0, 
            N'{"contentUrl":"https://www.youtube.com/embed/dQw4w9WgXcQ","durationSeconds":1500}');
END
