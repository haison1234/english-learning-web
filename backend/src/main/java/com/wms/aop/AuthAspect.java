package com.wms.aop;

import com.wms.annotation.RequireAuth;
import com.wms.entity.User;
import com.wms.exception.ForbiddenException;
import com.wms.exception.UnauthorizedException;
import com.wms.repository.UserRepository;
import com.wms.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Optional;

@Aspect
@Component
public class AuthAspect {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AuthAspect(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Before("@annotation(com.wms.annotation.RequireAuth)")
    public void checkAuthentication(JoinPoint joinPoint) {
        System.out.println("🛡️ AOP Authentication interceptor triggered...");

        // 1. Lấy HttpServletRequest từ RequestContext
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new UnauthorizedException("Yêu cầu HTTP không hợp lệ!");
        }
        HttpServletRequest request = attributes.getRequest();

        // 2. Đọc Header Authorization
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Bạn chưa đăng nhập! Vui lòng gửi kèm mã Token hợp lệ.");
        }

        String token = authHeader.substring(7); // Bỏ qua chữ "Bearer "

        // 3. Kiểm tra tính hợp lệ của Token
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Phiên đăng nhập đã hết hạn hoặc không hợp lệ!");
        }

        // 4. Giải mã lấy Email
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 5. Kiểm tra người dùng có tồn tại trong Database không
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UnauthorizedException("Tài khoản người dùng không tồn tại!");
        }
        User user = userOptional.get();

        // 6. Kiểm tra quyền truy cập (Authorization)
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RequireAuth requireAuth = method.getAnnotation(RequireAuth.class);

        String[] allowedRoles = requireAuth.value();
        if (allowedRoles.length > 0) {
            String userRole = user.getRole().name(); // ví dụ: "STUDENT" hoặc "ADMIN"
            boolean hasPermission = Arrays.asList(allowedRoles).contains(userRole);
            if (!hasPermission) {
                throw new ForbiddenException("Bạn không có quyền truy cập chức năng này!");
            }
        }

        // 7. Đẩy thông tin user hiện tại vào thuộc tính của request để Controller có thể tái sử dụng nếu cần
        request.setAttribute("currentUser", user);
        System.out.println("✅ Authorization check passed for user: " + email + " with role: " + user.getRole());
    }
}
