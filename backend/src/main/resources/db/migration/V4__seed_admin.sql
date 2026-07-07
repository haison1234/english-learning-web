-- ============================================================
-- V4: SEED DATA FOR TESTING (ADMIN, STUDENT, COURSE, LESSONS)
-- ============================================================

-- 1. Seed Admin Account (Email: admin@wms.com, Password: admin123)
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@wms.com')
BEGIN
    INSERT INTO Users (Id, FullName, Email, PasswordHash, Role, Status, CreatedAt)
    VALUES (NEWID(), N'System Admin', 'admin@wms.com', '$2a$10$5mdSGGNwGF1zJxooVoN5kO92nQhTws.wLjA0fymZiBFghbDNqOHt.', 0, 1, SYSUTCDATETIME());
END

-- 2. Seed Demo Student Account (Email: student@wms.com, Password: admin123)
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'student@wms.com')
BEGIN
    INSERT INTO Users (Id, FullName, Email, PasswordHash, Role, Status, CreatedAt)
    VALUES (NEWID(), N'Demo Student', 'student@wms.com', '$2a$10$5mdSGGNwGF1zJxooVoN5kO92nQhTws.wLjA0fymZiBFghbDNqOHt.', 1, 1, SYSUTCDATETIME());
END

-- 3. Seed Demo Course and Lessons
IF NOT EXISTS (SELECT 1 FROM Courses WHERE Title = N'English for Beginners')
BEGIN
    DECLARE @CourseId UNIQUEIDENTIFIER = NEWID();
    
    -- Course
    INSERT INTO Courses (Id, Title, Level, Price, Status, Metadata, CreatedAt)
    VALUES (@CourseId, N'English for Beginners', 0, 199000, 1, 
            N'{"description":"Learn basic English grammar, vocabulary, and communication.","thumbnail":"/images/course-beginner.jpg","trailerUrl":""}', 
            SYSUTCDATETIME());

    -- Lesson 1 (Video)
    INSERT INTO Lessons (Id, CourseId, Title, IsPreview, OrderIndex, Type, Content, CreatedAt)
    VALUES (NEWID(), @CourseId, N'Lesson 1: Introduction to English', 1, 1, 0, 
            N'{"videoUrl":"https://www.youtube.com/embed/dQw4w9WgXcQ","duration":180}', 
            SYSUTCDATETIME());

    -- Lesson 2 (Quiz)
    INSERT INTO Lessons (Id, CourseId, Title, IsPreview, OrderIndex, Type, Content, CreatedAt)
    VALUES (NEWID(), @CourseId, N'Lesson 2: Basic Grammar Quiz', 0, 2, 1, 
            N'{"questions":[{"id":"1","content":"What is the capital of England?","options":["Paris","London","Berlin","Rome"],"correctAnswer":"London"}]}', 
            SYSUTCDATETIME());
END
