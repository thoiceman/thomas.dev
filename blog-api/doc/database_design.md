# 博客项目数据库设计文档

> 创建时间：2025年

## 项目概述

这是一个全栈博客项目的数据库设计，支持以下技术栈：
- **后端**：Spring Boot
- **前端**：Next.js
- **后台管理**：React
- **数据库**：MySQL 8.0+

## 核心模块

### 1. 首页模块
- 展示最新文章、精选内容
- 个人简介和技术栈展示
- 最新想法和旅行动态

### 2. 技术栈模块
- 个人技能展示
- 技术熟练度评估
- 技术分类管理

### 3. 想法模块
- 类似微博的动态发布
- 支持图片、位置、心情
- 简洁的内容展示

### 4. 写作模块
- Markdown文章编辑
- 分类标签管理
- 文章状态控制

### 5. 旅行模块
- 旅行记录管理
- 地理位置信息
- 相册和游记

### 6. 项目模块
- 个人项目展示
- 技术栈标注
- 演示链接管理

**注意**：本项目不包含评论、点赞、浏览统计功能，书签功能使用 Raindrop.io 实现。

## 数据库表结构设计

### 用户管理模块

#### user - 用户表
```sql
-- 核心字段
id              用户ID（主键）
username        用户名（唯一）
email           邮箱（唯一）
password        密码（加密存储）
nickname        昵称
avatar          头像URL
bio             个人简介
website         个人网站
github          GitHub用户名
role            角色（0-普通用户，1-管理员）
status          状态（0-禁用，1-启用）

-- 登录信息
last_login_time 最后登录时间
last_login_ip   最后登录IP

-- 通用字段
create_time     创建时间
update_time     更新时间
is_delete       逻辑删除标记
```

**设计要点：**
- 支持用户名和邮箱登录
- 密码使用BCrypt加密
- 支持角色权限控制
- 记录登录状态便于安全审计

### 内容分类管理

#### category - 分类表
```sql
id              分类ID
name            分类名称
slug            URL友好别名
description     分类描述
icon            分类图标
color           分类颜色
sort_order      排序权重
status          状态
```

#### tag - 标签表
```sql
id              标签ID
name            标签名称
slug            URL友好别名
color           标签颜色
use_count       使用次数（便于热门标签统计）
```

**设计要点：**
- slug字段支持SEO友好的URL
- 颜色字段支持前端个性化展示
- 使用次数统计便于标签云展示

### 文章写作模块

#### article - 文章表
```sql
-- 基本信息
id              文章ID
title           文章标题
slug            URL友好别名
summary         文章摘要
content         文章内容（Markdown格式）
cover_image     封面图片

-- 分类关联
category_id     分类ID（外键）
author_id       作者ID（外键）

-- 状态控制
status          状态（0-草稿，1-已发布，2-已下线）
is_top          是否置顶
is_featured     是否精选

-- 内容信息
word_count      字数统计
reading_time    预计阅读时间

-- 时间信息
publish_time    发布时间
create_time     创建时间
update_time     更新时间
```

#### article_tag - 文章标签关联表
```sql
id              关联ID
article_id      文章ID（外键）
tag_id          标签ID（外键）
create_time     创建时间
```

**设计要点：**
- 支持草稿和发布状态管理
- 文章和标签多对多关系
- 字数和阅读时间提升用户体验
- 移除了统计相关字段，保持简洁

### 技术栈模块

#### tech_stack - 技术栈表
```sql
id                  技术栈ID
name                技术名称
category            技术分类（前端/后端/数据库/工具等）
description         技术描述
icon                技术图标URL
official_url        官方网站
sort_order          排序权重
status              状态
```

**设计要点：**
- 支持技术分类管理
- 官方链接便于访问者了解技术详情

### 想法模块

#### thought - 想法表
```sql
id              想法ID
content         想法内容
images          图片列表（JSON格式）
mood            心情状态
location        地理位置
weather         天气情况
author_id       作者ID
status          状态（0-私密，1-公开）
```

**设计要点：**
- 类似微博的轻量级内容发布
- JSON字段存储图片列表，灵活支持多图
- 支持心情、位置、天气等丰富信息
- 隐私控制支持私密想法
- 简化设计，无需统计功能

### 旅行模块

#### travel - 旅行记录表
```sql
-- 基本信息
id              旅行记录ID
title           旅行标题
destination     目的地
country         国家
city            城市
description     旅行描述
content         详细游记内容

-- 媒体信息
cover_image     封面图片
images          相册图片列表（JSON）

-- 时间信息
start_date      开始日期
end_date        结束日期
duration        旅行天数

-- 详细信息
budget          预算/花费
companions      同行人员
transportation  交通方式
accommodation   住宿信息
highlights      亮点推荐（JSON）

-- 地理信息
latitude        纬度
longitude       经度

-- 评价信息
weather         天气情况
rating          评分（1-5星）
```

**设计要点：**
- 完整的旅行信息记录
- 地理坐标支持地图展示
- JSON字段灵活存储亮点和图片
- 评分系统便于推荐优质目的地
- 移除统计字段，专注内容本身

### 项目展示模块

#### project - 项目表
```sql
-- 基本信息
id              项目ID
name            项目名称
slug            URL友好别名
description     项目描述
content         项目详细介绍

-- 媒体信息
cover_image     项目封面图
images          项目截图列表（JSON）

-- 链接信息
demo_url        演示地址
github_url      GitHub地址
download_url    下载地址

-- 技术信息
tech_stack      技术栈（JSON）
features        主要功能（JSON）
project_type    项目类型

-- 状态信息
status          项目状态（0-停止维护，1-正在开发，2-已完成，3-暂停）
is_featured     是否精选
is_open_source  是否开源

-- 项目详情
start_date      开始日期
end_date        完成日期

-- 排序
sort_order      排序权重
```

**设计要点：**
- 完整的项目信息展示
- 支持多种项目类型
- 技术栈和功能使用JSON存储，便于前端展示
- 项目状态管理
- 专注项目展示，无需统计功能

### 系统配置模块

#### system_config - 系统配置表
```sql
id              配置ID
config_key      配置键（唯一）
config_value    配置值
config_type     配置类型（string/number/boolean/json）
description     配置描述
group_name      配置分组
is_public       是否公开（前台可见）
```

**设计要点：**
- 灵活的系统配置管理
- 支持不同数据类型
- 配置分组便于管理

## 数据库索引设计

### 主要索引策略

1. **主键索引**：所有表都有自增主键
2. **唯一索引**：用户名、邮箱、slug等唯一字段
3. **外键索引**：所有外键字段都建立索引
4. **查询索引**：根据常用查询条件建立复合索引
5. **排序索引**：根据排序字段建立索引

### 性能优化考虑

1. **读写分离**：支持主从复制
2. **分页查询**：使用LIMIT优化
3. **缓存策略**：热点数据Redis缓存
4. **JSON字段**：MySQL 8.0+ JSON类型优化

## 数据安全设计

### 1. 数据加密
- 用户密码使用BCrypt加密
- 敏感配置信息加密存储

### 2. 权限控制
- 基于角色的访问控制（RBAC）
- 内容可见性控制

### 3. 数据备份
- 定期数据库备份
- 重要操作日志记录

### 4. 防护措施
- SQL注入防护
- XSS攻击防护
- CSRF攻击防护

## 扩展性设计

### 1. 水平扩展
- 支持分库分表
- 读写分离架构

### 2. 功能扩展
- 插件化架构支持
- 自定义字段扩展

### 3. 多语言支持
- 国际化字段设计
- 多语言内容管理

## 使用说明

### 1. 环境要求
- MySQL 8.0+
- 支持JSON数据类型
- 支持全文索引

### 2. 部署步骤
1. 创建数据库：`CREATE DATABASE blog_db`
2. 执行建表脚本：`source blog_database_design.sql`
3. 配置应用连接参数
4. 启动应用服务

### 3. 初始化数据
- 默认管理员账号：admin/admin123
- 基础分类和标签数据
- 系统配置初始值
- 默认技术栈数据

## 设计特点

这个数据库设计具有以下特点：

1. **简洁性**：移除了评论、点赞、浏览统计等复杂功能，专注核心内容展示
2. **完整性**：覆盖博客系统的所有核心模块
3. **扩展性**：支持功能扩展和性能扩展
4. **安全性**：完善的权限控制和数据保护
5. **易用性**：清晰的表结构和字段命名
6. **性能**：合理的索引设计和查询优化
7. **现代化**：使用JSON字段存储复杂数据，支持灵活的数据结构

## 外部集成

- **书签管理**：使用 Raindrop.io 提供书签收藏功能
- **评论系统**：可选择集成第三方评论系统（如 Disqus、Gitalk 等）
- **统计分析**：可集成 Google Analytics 或其他统计工具

该设计可以支撑一个功能完整、性能优良的个人博客系统，同时保持代码和数据库的简洁性。