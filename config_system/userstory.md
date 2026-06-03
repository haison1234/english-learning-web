GUEST / KHÁCH (CHƯA ĐĂNG NHẬP)
US-G01Cao
Guest
Với tư cách là khách, tôi muốn xem danh sách khóa học, để tôi có thể biết nền tảng cung cấp những gì trước khi đăng ký.
Acceptance Criteria
•	Hiển thị danh sách khóa học với tên, ảnh bìa, mô tả ngắn và cấp độ
•	Có thể lọc theo cấp độ (Beginner / Intermediate / Advanced)
•	Không yêu cầu đăng nhập để xem trang này
US-G02Cao
Guest
Với tư cách là khách, tôi muốn xem trang chi tiết khóa học, để tôi hiểu nội dung và quyết định có đăng ký hay không.
Acceptance Criteria
•	Hiển thị syllabus (danh sách bài học), thời lượng, học phí, giáo viên
•	Nút "Đăng ký học" chuyển hướng đến trang đăng nhập/đăng ký
•	Preview video giới thiệu (nếu có) phát được mà không cần đăng nhập
US-G03Cao
Guest
Với tư cách là khách, tôi muốn đăng ký tài khoản, để tôi có thể đăng ký khóa học và bắt đầu học.
Acceptance Criteria
•	Form đăng ký gồm: họ tên, email, mật khẩu, xác nhận mật khẩu
•	Gửi email xác minh sau khi đăng ký thành công
•	Hiển thị lỗi rõ ràng nếu email đã tồn tại hoặc mật khẩu không khớp
US-G04Trung bình
Guest
Với tư cách là khách, tôi muốn đăng nhập vào tài khoản, để tôi truy cập được nội dung học đã đăng ký.
Acceptance Criteria
•	Đăng nhập bằng email + mật khẩu hoặc Google OAuth
•	Có chức năng "Quên mật khẩu" gửi link reset về email
•	Sau đăng nhập, chuyển hướng về trang học hoặc trang trước đó
STUDENT / HỌC SINH (ĐÃ ĐĂNG NHẬP & ĐĂNG KÝ KHÓA HỌC)
US-S01Cao
Student
Với tư cách là học sinh, tôi muốn đăng ký một khóa học, để tôi có thể truy cập toàn bộ nội dung bài học.
Acceptance Criteria
•	Có nút "Đăng ký" trên trang chi tiết khóa học khi đã đăng nhập
•	Hỗ trợ cả khóa học miễn phí và có phí (thanh toán qua cổng)
•	Sau khi đăng ký thành công, khóa học xuất hiện trong "Khóa học của tôi"
US-S02Cao
Student
Với tư cách là học sinh, tôi muốn xem và học bài học theo thứ tự, để tôi tiến bộ có hệ thống.
Acceptance Criteria
•	Bài học hiển thị theo thứ tự, bài sau mở khi hoàn thành bài trước
•	Hỗ trợ nội dung dạng video, văn bản, audio
•	Ghi nhớ vị trí dừng để tiếp tục học khi quay lại
US-S03Cao
Student
Với tư cách là học sinh, tôi muốn làm bài tập và kiểm tra, để tôi luyện tập và đánh giá kiến thức.
Acceptance Criteria
•	Hỗ trợ các dạng: trắc nghiệm, điền vào chỗ trống, ghép cặp
•	Hiển thị điểm số và đáp án sau khi nộp bài
•	Lưu lịch sử các lần làm bài để học sinh xem lại
US-S04Trung bình
Student
Với tư cách là học sinh, tôi muốn xem tiến độ học tập, để tôi biết mình đang ở đâu trong khóa học.
Acceptance Criteria
•	Thanh tiến độ hiển thị % đã hoàn thành trên trang khóa học
•	Đánh dấu bài học đã xem / chưa xem / đang học
•	Dashboard tổng hợp tiến độ tất cả khóa học đã đăng ký
US-S05Trung bình
Student
Với tư cách là học sinh, tôi muốn nhận thông báo về bài tập mới hoặc deadline, để tôi không bỏ lỡ nhiệm vụ.
Acceptance Criteria
•	Thông báo trong ứng dụng khi có bài tập mới được giao
•	Nhắc nhở qua email trước deadline 24 giờ
•	Học sinh có thể tắt/bật từng loại thông báo trong cài đặt
US-S06Trung bình
Student
Với tư cách là học sinh, tôi muốn tải chứng chỉ hoàn thành, để tôi có thể chia sẻ thành tích.
Acceptance Criteria
•	Chứng chỉ cấp tự động khi hoàn thành 100% khóa học
•	Có thể tải về dạng PDF với tên học sinh và ngày hoàn thành
•	Có mã xác thực duy nhất để bên thứ ba kiểm tra
US-S07Thấp
Student
Với tư cách là học sinh, tôi muốn đặt câu hỏi hoặc bình luận dưới bài học, để tôi được hỗ trợ khi gặp khó khăn.
Acceptance Criteria
•	Mỗi bài học có phần bình luận/hỏi đáp bên dưới
•	Admin có thể trả lời câu hỏi, học sinh nhận thông báo khi được phản hồi
•	Có thể upvote câu hỏi hữu ích để ưu tiên hiển thị
SYSTEM ADMIN (QUẢN TRỊ VIÊN)
US-A01Cao
Admin
Với tư cách là admin, tôi muốn tạo và quản lý khóa học, để nền tảng luôn có nội dung mới và cập nhật.
Acceptance Criteria
•	Tạo khóa học với tên, mô tả, cấp độ, học phí, ảnh bìa
•	Thêm / sửa / xóa bài học trong khóa học; kéo thả để sắp xếp thứ tự
•	Chuyển trạng thái: Draft → Published → Archived
US-A02Cao
Admin
Với tư cách là admin, tôi muốn tạo và giao bài tập cho học sinh, để đánh giá năng lực và củng cố kiến thức.
Acceptance Criteria
•	Tạo bài tập với các loại câu hỏi: trắc nghiệm, điền từ, ghép cặp
•	Gắn bài tập vào bài học cụ thể hoặc toàn bộ khóa học
•	Đặt deadline, số lần làm lại tối đa và điểm tối thiểu để qua
US-A03Cao
Admin
Với tư cách là admin, tôi muốn upload video, audio và tài liệu, để học sinh có đủ nguyên liệu học tập.
Acceptance Criteria
•	Upload video (MP4), audio (MP3) và PDF trực tiếp từ giao diện admin
•	Video được mã hóa/stream để tránh tải về trái phép
•	Hiển thị thanh tiến trình upload và thông báo khi hoàn thành
US-A04Trung bình
Admin
Với tư cách là admin, tôi muốn xem kết quả và thống kê bài tập của học sinh, để theo dõi hiệu quả học tập.
Acceptance Criteria
•	Bảng điểm tất cả học sinh theo từng bài tập / khóa học
•	Xuất file CSV/Excel để báo cáo
•	Biểu đồ điểm trung bình và phân phối điểm theo bài tập
US-A05Trung bình
Admin
Với tư cách là admin, tôi muốn quản lý danh sách người dùng, để kiểm soát truy cập và hỗ trợ khi cần.
Acceptance Criteria
•	Xem danh sách tất cả tài khoản với trạng thái active/inactive
•	Khoá / mở khoá tài khoản học sinh
•	Xem khóa học đã đăng ký và lịch sử bài tập của từng học sinh
US-A06Trung bình
Admin
Với tư cách là admin, tôi muốn gửi thông báo hàng loạt đến học sinh, để thông tin về khoá học mới hoặc cập nhật quan trọng.
Acceptance Criteria
•	Gửi thông báo in-app đến toàn bộ hoặc nhóm học sinh theo khóa học
•	Hỗ trợ gửi email thông báo hàng loạt
•	Xem lịch sử thông báo đã gửi với thời gian và nội dung
US-A07Thấp
Admin
Với tư cách là admin, tôi muốn tạo mã giảm giá (coupon), để khuyến khích học sinh đăng ký khóa học có phí.
Acceptance Criteria
•	Tạo mã coupon với % giảm hoặc số tiền cố định, giới hạn số lần dùng
•	Đặt ngày hết hạn cho từng mã
•	Theo dõi số lần mã đã được sử dụng trong thống kê



