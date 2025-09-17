-- 博客项目数据库设计
-- 创建时间：2025

-- 禁用外键检查（在创建表时）
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;

-- ================================
-- 1. 用户管理模块
-- ================================

-- 用户表
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
    `password` VARCHAR(255) NOT NULL COMMENT '密码（加密存储，使用bcrypt等安全算法）',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `bio` TEXT DEFAULT NULL COMMENT '个人简介',
    `website` VARCHAR(200) DEFAULT NULL COMMENT '个人网站',
    `github` VARCHAR(100) DEFAULT NULL COMMENT 'GitHub用户名',
    `role` TINYINT DEFAULT 0 COMMENT '角色：0-普通用户，1-管理员',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP（支持IPv6）',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_status` (`status`),
    KEY `idx_is_delete` (`is_delete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ================================
-- 2. 分类和标签管理
-- ================================

-- 分类表
CREATE TABLE `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `slug` VARCHAR(50) NOT NULL COMMENT '分类别名（URL友好）',
    `description` TEXT DEFAULT NULL COMMENT '分类描述',
    `icon` VARCHAR(100) DEFAULT NULL COMMENT '分类图标',
    `color` VARCHAR(20) DEFAULT NULL COMMENT '分类颜色',
    `sort_order` INT DEFAULT 0 COMMENT '排序权重',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_sort_order` (`sort_order`),
    KEY `idx_status` (`status`),
    KEY `idx_is_delete` (`is_delete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 标签表
CREATE TABLE `tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
    `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
    `slug` VARCHAR(50) NOT NULL COMMENT '标签别名（URL友好）',
    `color` VARCHAR(20) DEFAULT NULL COMMENT '标签颜色',
    `use_count` INT DEFAULT 0 COMMENT '使用次数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_use_count` (`use_count`),
    KEY `idx_is_delete` (`is_delete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ================================
-- 3. 文章/写作模块
-- ================================

-- 文章表
CREATE TABLE `article` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
    `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
    `slug` VARCHAR(200) NOT NULL COMMENT '文章别名（URL友好）',
    `summary` TEXT DEFAULT NULL COMMENT '文章摘要',
    `content` LONGTEXT NOT NULL COMMENT '文章内容（Markdown）',
    `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图片URL',
    `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `status` TINYINT DEFAULT 0 COMMENT '状态：0-草稿，1-已发布，2-已下线',
    `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶：0-否，1-是',
    `is_featured` TINYINT DEFAULT 0 COMMENT '是否精选：0-否，1-是',
    `word_count` INT DEFAULT 0 COMMENT '字数统计',
    `reading_time` INT DEFAULT 0 COMMENT '预计阅读时间（分钟）',
    `publish_time` DATETIME DEFAULT NULL COMMENT '发布时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_author_id` (`author_id`),
    KEY `idx_status` (`status`),
    KEY `idx_publish_time` (`publish_time`),
    KEY `idx_is_delete` (`is_delete`),
    KEY `idx_is_top` (`is_top`),
    KEY `idx_is_featured` (`is_featured`),
    FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 文章标签关联表
CREATE TABLE `article_tag` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '关联ID',
    `article_id` BIGINT NOT NULL COMMENT '文章ID',
    `tag_id` BIGINT NOT NULL COMMENT '标签ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_article_tag` (`article_id`, `tag_id`),
    KEY `idx_tag_id` (`tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- ================================
-- 4. 技术栈模块
-- ================================

-- 技术栈表
CREATE TABLE `tech_stack` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '技术栈ID',
    `name` VARCHAR(100) NOT NULL COMMENT '技术名称',
    `category` VARCHAR(50) NOT NULL COMMENT '技术分类（前端/后端/数据库/工具等）',
    `description` TEXT DEFAULT NULL COMMENT '技术描述',
    `icon` VARCHAR(200) DEFAULT NULL COMMENT '技术图标URL',
    `official_url` VARCHAR(200) DEFAULT NULL COMMENT '官方网站',

    `sort_order` INT DEFAULT 0 COMMENT '排序权重',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-不展示，1-展示',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_sort_order` (`sort_order`),
    KEY `idx_status` (`status`),
    KEY `idx_is_delete` (`is_delete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='技术栈表';

-- ================================
-- 5. 想法模块（类似微博/动态）
-- ================================

-- 想法表
CREATE TABLE `thought` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '想法ID',
    `content` TEXT NOT NULL COMMENT '想法内容',
    `images` JSON DEFAULT NULL COMMENT '图片列表（JSON数组）',
    `mood` VARCHAR(20) DEFAULT NULL COMMENT '心情状态',
    `location` VARCHAR(100) DEFAULT NULL COMMENT '地理位置',
    `weather` VARCHAR(50) DEFAULT NULL COMMENT '天气情况',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-私密，1-公开',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_author_id` (`author_id`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_status` (`status`),
    KEY `idx_is_delete` (`is_delete`),
    FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='想法表';

-- ================================
-- 6. 旅行模块
-- ================================

-- 旅行记录表
CREATE TABLE `travel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '旅行记录ID',
    `title` VARCHAR(200) NOT NULL COMMENT '旅行标题',
    `destination` VARCHAR(100) NOT NULL COMMENT '目的地',
    `country` VARCHAR(50) DEFAULT NULL COMMENT '国家',
    `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
    `description` TEXT DEFAULT NULL COMMENT '旅行描述',
    `content` LONGTEXT DEFAULT NULL COMMENT '详细游记内容',
    `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图片',
    `images` JSON DEFAULT NULL COMMENT '相册图片列表（JSON数组）',
    `start_date` DATE NOT NULL COMMENT '开始日期',
    `end_date` DATE NOT NULL COMMENT '结束日期',
    `duration` INT DEFAULT NULL COMMENT '旅行天数',
    `budget` DECIMAL(10,2) DEFAULT NULL COMMENT '预算/花费',
    `companions` VARCHAR(200) DEFAULT NULL COMMENT '同行人员',
    `transportation` VARCHAR(100) DEFAULT NULL COMMENT '交通方式',
    `accommodation` VARCHAR(200) DEFAULT NULL COMMENT '住宿信息',
    `highlights` JSON DEFAULT NULL COMMENT '亮点/推荐（JSON数组）',
    `latitude` DECIMAL(10,8) DEFAULT NULL COMMENT '纬度',
    `longitude` DECIMAL(11,8) DEFAULT NULL COMMENT '经度',
    `weather` VARCHAR(50) DEFAULT NULL COMMENT '天气情况',
    `rating` TINYINT DEFAULT NULL COMMENT '评分（1-5星）',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-私密，1-公开',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    KEY `idx_destination` (`destination`),
    KEY `idx_start_date` (`start_date`),
    KEY `idx_author_id` (`author_id`),
    KEY `idx_rating` (`rating`),
    KEY `idx_status` (`status`),
    KEY `idx_is_delete` (`is_delete`),
    FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='旅行记录表';

-- ================================
-- 7. 项目展示模块
-- ================================

-- 项目表
CREATE TABLE `project` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '项目ID',
    `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
    `slug` VARCHAR(100) NOT NULL COMMENT '项目别名（URL友好）',
    `description` TEXT DEFAULT NULL COMMENT '项目描述',
    `content` LONGTEXT DEFAULT NULL COMMENT '项目详细介绍',
    `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '项目封面图',
    `images` JSON DEFAULT NULL COMMENT '项目截图列表（JSON数组）',
    `demo_url` VARCHAR(200) DEFAULT NULL COMMENT '演示地址',
    `github_url` VARCHAR(200) DEFAULT NULL COMMENT 'GitHub地址',
    `download_url` VARCHAR(200) DEFAULT NULL COMMENT '下载地址',
    `tech_stack` JSON DEFAULT NULL COMMENT '技术栈（JSON数组）',
    `features` JSON DEFAULT NULL COMMENT '主要功能（JSON数组）',
    `project_type` VARCHAR(50) DEFAULT NULL COMMENT '项目类型（Web应用/移动应用/桌面应用/开源库等）',
    `status` TINYINT DEFAULT 1 COMMENT '项目状态：0-停止维护，1-正在开发，2-已完成，3-暂停',
    `is_featured` TINYINT DEFAULT 0 COMMENT '是否精选：0-否，1-是',
    `is_open_source` TINYINT DEFAULT 0 COMMENT '是否开源：0-否，1-是',
    `start_date` DATE DEFAULT NULL COMMENT '开始日期',
    `end_date` DATE DEFAULT NULL COMMENT '完成日期',
    -- 排序
    `sort_order` INT DEFAULT 0 COMMENT '排序权重',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_delete` TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_project_type` (`project_type`),
    KEY `idx_status` (`status`),
    KEY `idx_author_id` (`author_id`),
    KEY `idx_sort_order` (`sort_order`),
    KEY `idx_is_delete` (`is_delete`),
    KEY `idx_is_featured` (`is_featured`),
    KEY `idx_is_open_source` (`is_open_source`),
    FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

-- ================================
-- 8. 系统配置模块
-- ================================

-- 系统配置表
CREATE TABLE `system_config` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
    `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
    `config_value` TEXT DEFAULT NULL COMMENT '配置值',
    `config_type` VARCHAR(20) DEFAULT 'string' COMMENT '配置类型（string/number/boolean/json）',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '配置描述',
    `group_name` VARCHAR(50) DEFAULT 'default' COMMENT '配置分组',
    `is_public` TINYINT DEFAULT 0 COMMENT '是否公开：0-后台配置，1-前台可见',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_config_key` (`config_key`),
    KEY `idx_group_name` (`group_name`),
    KEY `idx_is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- ================================
-- 初始化数据
-- ================================

-- 插入默认管理员用户
INSERT INTO `user` (`username`, `email`, `password`, `nickname`, `role`, `status`) 
VALUES ('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXIGfKx6kMjE1UYPKZDdAQw4YIm', '管理员', 1, 1);

-- 插入默认分类
INSERT INTO `category` (`name`, `slug`, `description`, `icon`, `color`, `sort_order`) VALUES
('技术分享', 'tech', '技术相关的文章和教程', 'code', '#3b82f6', 1),
('生活随笔', 'life', '生活感悟和日常记录', 'heart', '#ef4444', 2),
('项目总结', 'project', '项目开发经验和总结', 'folder', '#10b981', 3),
('学习笔记', 'study', '学习过程中的笔记和心得', 'book', '#f59e0b', 4);

-- 插入默认标签
INSERT INTO `tag` (`name`, `slug`, `color`) VALUES
('Java', 'java', '#ed8936'),
('Spring Boot', 'spring-boot', '#38a169'),
('Vue.js', 'vuejs', '#4fd1c7'),
('React', 'react', '#4299e1'),
('MySQL', 'mysql', '#3182ce'),
('Redis', 'redis', '#e53e3e'),
('Docker', 'docker', '#2496ed');

-- 插入默认技术栈
INSERT INTO `tech_stack` (`name`, `category`, `description`, `sort_order`) VALUES
('Java', '后端', 'Java编程语言，企业级应用开发', 1),
('Spring Boot', '后端', 'Spring Boot框架，快速构建微服务', 2),
('Vue.js', '前端', 'Vue.js前端框架，构建用户界面', 3),
('React', '前端', 'React前端库，组件化开发', 4),
('MySQL', '数据库', 'MySQL关系型数据库', 5),
('Redis', '数据库', 'Redis内存数据库，缓存和会话存储', 6),
('Docker', '工具', 'Docker容器化技术', 7);

-- 插入系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `config_type`, `description`, `group_name`, `is_public`) VALUES
('site_name', '聪的博客', 'string', '网站名称', 'basic', 1),
('site_description', '一个专注于技术分享的个人博客', 'string', '网站描述', 'basic', 1),
('site_keywords', '博客,技术,编程,Java,前端', 'string', '网站关键词', 'basic', 1),
('site_author', '聪', 'string', '网站作者', 'basic', 1),
('site_email', 'contact@example.com', 'string', '联系邮箱', 'basic', 1),
('github_url', 'https://github.com/lhcxu', 'string', 'GitHub地址', 'social', 1),
('registration_enabled', 'false', 'boolean', '是否开启注册', 'feature', 0);

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;