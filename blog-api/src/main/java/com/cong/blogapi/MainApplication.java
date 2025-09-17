package com.cong.blogapi;

import io.github.cdimascio.dotenv.Dotenv;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 主类（项目启动入口）
 * # @author <a href="https://github.com/lhccong">程序员聪</a>
 */
// todo 如需开启 Redis，须移除 exclude 中的内容
@SpringBootApplication()
@MapperScan("com.cong.blogapi.mapper")
@EnableScheduling
@EnableAspectJAutoProxy(proxyTargetClass = true, exposeProxy = true)
public class MainApplication {

    public static void main(String[] args) {
        // 加载.env文件中的环境变量
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")  // .env文件所在目录
                    .ignoreIfMalformed()  // 忽略格式错误的行
                    .ignoreIfMissing()    // 如果文件不存在则忽略
                    .load();
            
            // 将.env文件中的变量设置为系统属性
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
        } catch (Exception e) {
            System.out.println("Warning: Could not load .env file: " + e.getMessage());
        }
        
        SpringApplication.run(MainApplication.class, args);
    }

}
