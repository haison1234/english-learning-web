# WMS Backend - AI Agent Guidelines

Thư mục này chứa mã nguồn Backend cho hệ thống WMS (Warehouse Management System), sử dụng Spring Boot 3.4.5 và Java 21.

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.4.5
- **Build Tool**: Maven (`pom.xml`)
- **Database Access**: Spring Data JPA
- **Database Migration**: Flyway (`src/main/resources/db/migration`)
- **Testing**: JUnit 5, Mockito

## Commands cơ bản
- **Build**: `mvn clean install` hoặc `./mvnw clean install`
- **Chạy ứng dụng**: `mvn spring-boot:run` hoặc `./mvnw spring-boot:run`
- **Chạy Tests**: `mvn test` hoặc `./mvnw test`

## Kiến trúc dự án (Layered Architecture)
Mã nguồn nằm trong thư mục `src/main/java/com/wms/` và chia thành các package:
- `aop/`: Aspect Oriented Programming (Audit Logging, Exception Handling, Performance monitoring).
- `config/`: Các file cấu hình Spring, Security (JWT), JPA Auditor,...
- `controller/`: REST API Controllers định nghĩa các endpoint `/api/v1/*`.
- `dto/`: Request/Response Data Transfer Objects (luôn trả về DTO thay vì Entity trực tiếp).
- `entity/`: Các đối tượng JPA Entity tương ứng với các bảng trong cơ sở dữ liệu.
- `enums/`: Các Domain Enum (WarehouseStatus, ReceiptStatus, BatchGrade...).
- `event/`: Domain Events & Audit Events.
- `exception/`: Định nghĩa các custom exceptions và Global Error Handler.
- `repository/`: Spring Data JPA Repositories để truy vấn database.
- `service/`: Nơi xử lý Business Logic chính.
- `util/`: Các hàm tiện ích (Helper utilities, FEFO/FIFO selector...).

## Nguyên tắc viết Code
1. **Kiểu dữ liệu & Clean Code**: Luôn sử dụng DTO cho Requests & Responses, không expose trực tiếp Entity ra ngoài API.
2. **Xử lý ngoại lệ**: Tất cả custom exception đều phải được xử lý tập trung trong `exception/GlobalExceptionHandler`.
3. **Database Migration**: Không chỉnh sửa database bằng tay. Luôn dùng Flyway migration file trong `src/main/resources/db/migration/` khi thay đổi schema.
4. **Viết test**: Mỗi chức năng nghiệp vụ quan trọng trong Service/Controller đều cần có Unit/Integration tests tương ứng.
