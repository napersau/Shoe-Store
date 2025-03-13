package com.java.shopapp.utils;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Component
public class UploadFileUtils {
    public static void writeOrUpdate(String path, byte[] bytes) {

        path = "C:/Users/84334/Desktop/react/example-webapp/public/" + path;

        File file = new File(StringUtils.substringBeforeLast(path, "/"));
        if (!file.exists()) {
            file.mkdirs();
        }
        try (FileOutputStream fop = new FileOutputStream(path)) {
            fop.write(bytes);
            fop.flush(); // Đảm bảo tất cả dữ liệu được ghi
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
