CREATE TABLE NotificationCampaigns (
                                       Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
                                       Title NVARCHAR(255) NOT NULL,
                                       Content NVARCHAR(MAX) NOT NULL,
                                       Type TINYINT NOT NULL, -- 0: IN_APP, 1: EMAIL, 2: BOTH
                                       TargetAudience VARCHAR(50) NOT NULL, -- 'ALL' hoặc 'COURSE'
                                       CourseId UNIQUEIDENTIFIER NULL,
                                       SentAt DATETIME2 DEFAULT SYSUTCDATETIME()
);