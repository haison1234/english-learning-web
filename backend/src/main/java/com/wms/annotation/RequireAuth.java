package com.wms.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireAuth {
    String[] value() default {}; // Các role được phép truy cập, ví dụ: "STUDENT", "ADMIN"
}
