-- =============================================
-- SmartAdmin 规范 MySQL 数据库表设计
-- 项目：mayekun.com 博客系统
-- 作者：mayekun
-- 创建时间：2024
-- 更新时间：2026-06-15
-- =============================================

-- 数据库配置
-- 字符集：utf8mb4
-- 排序规则：utf8mb4_general_ci
-- 存储引擎：InnoDB

-- =============================================
-- 1. 文章表
-- =============================================
CREATE TABLE `b_article` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(200) NOT NULL COMMENT '文章标题',
  `summary` varchar(500) DEFAULT NULL COMMENT '文章摘要',
  `content` longtext COMMENT '文章内容(Markdown)',
  `cover` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
  `category_id` bigint(20) DEFAULT NULL COMMENT '分类ID',
  `author` varchar(50) DEFAULT NULL COMMENT '作者',
  `read_time` int(11) DEFAULT 0 COMMENT '阅读时长(分钟)',
  `views` int(11) DEFAULT 0 COMMENT '阅读量',
  `like_count` int(11) DEFAULT 0 COMMENT '点赞数',
  `commenb_count` int(11) DEFAULT 0 COMMENT '评论数',
  `is_top` tinyint(1) DEFAULT 0 COMMENT '是否置顶 0:否 1:是',
  `is_recommend` tinyint(1) DEFAULT 0 COMMENT '是否推荐 0:否 1:是',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:草稿 1:已发布 2:已下架',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_deleted_flag` (`deleted_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- =============================================
-- 2. 作品表
-- =============================================
CREATE TABLE `b_work` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(200) NOT NULL COMMENT '作品标题',
  `description` varchar(1000) DEFAULT NULL COMMENT '作品描述',
  `cover` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
  `images` text COMMENT '作品展示图片列表(JSON数组)',
  `category_id` bigint(20) DEFAULT NULL COMMENT '分类ID',
  `link` varchar(500) DEFAULT NULL COMMENT '作品链接',
  `github` varchar(500) DEFAULT NULL COMMENT 'GitHub链接',
  `views` int(11) DEFAULT 0 COMMENT '浏览量',
  `like_count` int(11) DEFAULT 0 COMMENT '点赞数',
  `is_recommend` tinyint(1) DEFAULT 0 COMMENT '是否推荐 0:否 1:是',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:隐藏 1:显示',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_flag` (`deleted_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作品表';

-- =============================================
-- 3. 分类表
-- =============================================
CREATE TABLE `b_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `code` varchar(50) DEFAULT NULL COMMENT '分类编码',
  `type` tinyint(1) DEFAULT 1 COMMENT '类型 1:文章分类 2:作品分类',
  `parenb_id` bigint(20) DEFAULT 0 COMMENT '父级ID',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name_type` (`name`, `type`),
  KEY `idx_type` (`type`),
  KEY `idx_parenb_id` (`parenb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- =============================================
-- 4. 标签表
-- =============================================
CREATE TABLE `b_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '标签名称',
  `code` varchar(50) DEFAULT NULL COMMENT '标签编码',
  `color` varchar(20) DEFAULT NULL COMMENT '标签颜色',
  `type` tinyint(1) DEFAULT 1 COMMENT '类型 1:文章标签 2:作品标签',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name_type` (`name`, `type`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- =============================================
-- 5. 文章标签关联表
-- =============================================
CREATE TABLE `b_article_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `article_id` bigint(20) NOT NULL COMMENT '文章ID',
  `tag_id` bigint(20) NOT NULL COMMENT '标签ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_tag` (`article_id`, `tag_id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关联表';

-- =============================================
-- 6. 作品标签关联表
-- =============================================
CREATE TABLE `b_work_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `work_id` bigint(20) NOT NULL COMMENT '作品ID',
  `tag_id` bigint(20) NOT NULL COMMENT '标签ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_work_tag` (`work_id`, `tag_id`),
  KEY `idx_work_id` (`work_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作品标签关联表';

-- =============================================
-- 7. 个人信息表
-- =============================================
CREATE TABLE `b_profile` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `bio` varchar(500) DEFAULT NULL COMMENT '个人简介',
  `title` varchar(100) DEFAULT NULL COMMENT '职位头衔',
  `location` varchar(100) DEFAULT NULL COMMENT '所在地',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `wechat` varchar(50) DEFAULT NULL COMMENT '微信号',
  `qq` varchar(20) DEFAULT NULL COMMENT 'QQ号',
  `github` varchar(200) DEFAULT NULL COMMENT 'GitHub',
  `twitter` varchar(200) DEFAULT NULL COMMENT 'Twitter/X',
  `linkedin` varchar(200) DEFAULT NULL COMMENT 'LinkedIn',
  `weibo` varchar(200) DEFAULT NULL COMMENT '微博',
  `gitee` varchar(200) DEFAULT NULL COMMENT 'Gitee',
  `juejin` varchar(200) DEFAULT NULL COMMENT '掘金',
  `website` varchar(200) DEFAULT NULL COMMENT '个人网站',
  `resume_url` varchar(500) DEFAULT NULL COMMENT '简历链接',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='个人信息表';

-- =============================================
-- 8. 技能表
-- =============================================
CREATE TABLE `b_skill` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '技能名称',
  `level` int(11) DEFAULT 0 COMMENT '熟练程度 0-100',
  `category` varchar(50) DEFAULT NULL COMMENT '技能分类(保留,暂未使用)',
  `icon` varchar(200) DEFAULT NULL COMMENT '图标名称(devicon标识)',
  `url` varchar(500) DEFAULT NULL COMMENT '技能官网链接',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能表';

-- =============================================
-- 9. 成长轨迹表
-- =============================================
CREATE TABLE `b_growth_timeline` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `year` int(11) NOT NULL COMMENT '年份',
  `label` varchar(50) NOT NULL COMMENT '阶段标签(如:诞生/小学/初中/高中/大学/工作/现在/未来)',
  `description` varchar(500) DEFAULT NULL COMMENT '阶段描述',
  `achievement` varchar(500) DEFAULT NULL COMMENT '成就/里程碑',
  `color` varchar(20) DEFAULT NULL COMMENT '节点颜色',
  `icon_type` varchar(50) DEFAULT NULL COMMENT '人物图标类型(baby/child/teen/student/worker/now/future)',
  `is_current` tinyint(1) DEFAULT 0 COMMENT '是否当前阶段 0:否 1:是',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:隐藏 1:显示',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_year` (`year`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成长轨迹表';

-- =============================================
-- 10. 广西景点推荐表
-- =============================================
CREATE TABLE `b_scenic_spot` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '景点名称',
  `description` varchar(500) DEFAULT NULL COMMENT '景点描述',
  `image` varchar(500) NOT NULL COMMENT '景点图片URL',
  `location` varchar(200) DEFAULT NULL COMMENT '景点位置',
  `rating` decimal(2,1) DEFAULT NULL COMMENT '评分(0.0-5.0)',
  `tags` varchar(500) DEFAULT NULL COMMENT '景点标签(JSON数组,如:["山水","5A"])',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:隐藏 1:显示',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户ID(管理员为空,用户推荐则有值)',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广西景点推荐表';

-- =============================================
-- 11. 景点用户推荐表(待审核)
-- =============================================
CREATE TABLE `b_scenic_recommend` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '景点名称',
  `description` varchar(500) DEFAULT NULL COMMENT '景点描述',
  `image` varchar(500) DEFAULT NULL COMMENT '景点图片URL',
  `location` varchar(200) DEFAULT NULL COMMENT '景点位置',
  `submitter_name` varchar(50) DEFAULT NULL COMMENT '推荐人昵称',
  `submitter_contact` varchar(100) DEFAULT NULL COMMENT '推荐人联系方式',
  `audib_status` tinyint(1) DEFAULT 0 COMMENT '审核状态 0:待审核 1:已通过 2:已拒绝',
  `audib_remark` varchar(200) DEFAULT NULL COMMENT '审核备注',
  `audib_user_id` bigint(20) DEFAULT NULL COMMENT '审核人ID',
  `audib_time` datetime DEFAULT NULL COMMENT '审核时间',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_audib_status` (`audib_status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景点用户推荐表(待审核)';

-- =============================================
-- 12. 热力图活动记录表
-- =============================================
CREATE TABLE `b_activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `activity_date` date NOT NULL COMMENT '活动日期',
  `count` int(11) DEFAULT 1 COMMENT '当日活动次数',
  `type` tinyint(1) DEFAULT 1 COMMENT '活动类型 1:写文章 2:写代码 3:学习 4:其他',
  `remark` varchar(200) DEFAULT NULL COMMENT '活动备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_date_type` (`activity_date`, `type`),
  KEY `idx_activity_date` (`activity_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='热力图活动记录表';

-- =============================================
-- 13. 阅读记录表（通用，支持文章和作品）
-- =============================================
CREATE TABLE `b_view_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `targeb_type` tinyint(1) NOT NULL COMMENT '目标类型 1:文章 2:作品',
  `targeb_id` bigint NOT NULL COMMENT '目标ID',
  `user_id` bigint DEFAULT NULL COMMENT '用户ID（未登录为空）',
  `ip` varchar(50) DEFAULT NULL COMMENT '访问IP',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '用户代理',
  `referer` varchar(500) DEFAULT NULL COMMENT '来源页面',
  `view_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_target` (`targeb_type`, `targeb_id`),
  KEY `idx_view_time` (`view_time`),
  KEY `idx_target_ip` (`targeb_type`, `targeb_id`, `ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='阅读记录表';

-- =============================================
-- 14. 评论表
-- =============================================
CREATE TABLE `b_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `targeb_type` tinyint(1) NOT NULL COMMENT '目标类型 1:文章 2:作品',
  `targeb_id` bigint(20) NOT NULL COMMENT '目标ID',
  `parenb_id` bigint(20) DEFAULT 0 COMMENT '父评论ID',
  `reply_id` bigint(20) DEFAULT NULL COMMENT '回复评论ID',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `website` varchar(200) DEFAULT NULL COMMENT '网站',
  `content` varchar(1000) NOT NULL COMMENT '评论内容',
  `like_count` int(11) DEFAULT 0 COMMENT '点赞数',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:待审核 1:已审核 2:已拒绝',
  `ip` varchar(50) DEFAULT NULL COMMENT '评论IP',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_target` (`targeb_type`, `targeb_id`),
  KEY `idx_parenb_id` (`parenb_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- =============================================
-- 16. 友情链接表
-- =============================================
CREATE TABLE `b_friend_link` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '网站名称',
  `url` varchar(200) NOT NULL COMMENT '网站链接',
  `logo` varchar(500) DEFAULT NULL COMMENT '网站Logo',
  `description` varchar(200) DEFAULT NULL COMMENT '网站描述',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='友情链接表';

-- =============================================
-- 17. 系统配置表
-- =============================================
CREATE TABLE `b_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `config_type` varchar(50) DEFAULT NULL COMMENT '配置类型',
  `description` varchar(200) DEFAULT NULL COMMENT '配置说明',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- =============================================
-- 18. 用户表(后台管理)
-- =============================================
CREATE TABLE `b_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(200) NOT NULL COMMENT '密码(加密)',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `role` varchar(20) DEFAULT 'admin' COMMENT '角色 admin:管理员 editor:编辑',
  `lasb_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `lasb_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态 0:禁用 1:启用',
  `deleted_flag` tinyint(1) DEFAULT 0 COMMENT '删除标识 0:未删除 1:已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表(后台管理)';

-- =============================================
-- 初始化数据
-- =============================================

-- 初始化分类(文章)
INSERT INTO `b_category` (`name`, `code`, `type`, `sort`, `status`) VALUES
('前端开发', 'frontend', 1, 1, 1),
('后端开发', 'backend', 1, 2, 1),
('DevOps', 'devops', 1, 3, 1),
('设计', 'design', 1, 4, 1),
('其他', 'other', 1, 5, 1);

-- 初始化分类(作品)
INSERT INTO `b_category` (`name`, `code`, `type`, `sort`, `status`) VALUES
('网站', 'website', 2, 1, 1),
('应用', 'app', 2, 2, 1),
('平台', 'platform', 2, 3, 1),
('小程序', 'miniapp', 2, 4, 1),
('工具', 'tool', 2, 5, 1);

-- 初始化个人信息
INSERT INTO `b_profile` (`name`, `avatar`, `bio`, `title`, `location`, `email`, `qq`, `github`, `twitter`, `gitee`, `juejin`, `website`) VALUES
('马业坤', '/my.jpg', '全栈开发工程师，热爱技术，热爱生活', '全栈开发工程师 / 技术博主', '中国·玉林', '2532615203@qq.com', '2532615203', 'https://github.com/eonsee', 'https://twitter.com', 'https://gitee.com', 'https://juejin.cn', 'https://mayekun.com');

-- 初始化技能
INSERT INTO `b_skill` (`name`, `icon`, `url`, `sort`, `status`) VALUES
('Java', 'java', 'https://www.java.com', 1, 1),
('Spring Boot', 'spring', 'https://spring.io/projects/spring-boot', 2, 1),
('Spring Cloud', 'spring', 'https://spring.io/projects/spring-cloud', 3, 1),
('MyBatis', NULL, 'https://mybatis.org', 4, 1),
('MySQL', 'mysql', 'https://www.mysql.com', 5, 1),
('Redis', 'redis', 'https://redis.io', 6, 1),
('RabbitMQ', 'rabbitmq', 'https://www.rabbitmq.com', 7, 1),
('Elasticsearch', 'elasticsearch', 'https://www.elastic.co', 8, 1),
('Docker', 'docker', 'https://www.docker.com', 9, 1),
('Kubernetes', 'kubernetes', 'https://kubernetes.io', 10, 1),
('Nginx', 'nginx', 'https://nginx.org', 11, 1),
('Vue.js', 'vuejs', 'https://vuejs.org', 12, 1),
('TypeScript', 'typescript', 'https://www.typescriptlang.org', 13, 1),
('Python', 'python', 'https://www.python.org', 14, 1),
('Git', 'git', 'https://git-scm.com', 15, 1),
('Linux', 'linux', 'https://www.linux.org', 16, 1),
('IntelliJ IDEA', 'intellij', 'https://www.jetbrains.com/idea', 17, 1),
('VS Code', 'vscode', 'https://code.visualstudio.com', 18, 1),
('Maven', 'maven', 'https://maven.apache.org', 19, 1),
('Postman', 'postman', 'https://www.postman.com', 20, 1),
('Jenkins', 'jenkins', 'https://www.jenkins.io', 21, 1),
('Gradle', 'gradle', 'https://gradle.org', 22, 1);

-- 初始化成长轨迹
INSERT INTO `b_growth_timeline` (`year`, `label`, `description`, `achievement`, `color`, `icon_type`, `is_current`, `sort`, `status`) VALUES
(2001, '诞生', '来到这个世界', NULL, '#f472b6', 'baby', 0, 1, 1),
(2006, '小学', '开始求学之路', NULL, '#fb923c', 'child', 0, 2, 1),
(2014, '初中', '少年时代的探索', NULL, '#facc15', 'teen', 0, 3, 1),
(2017, '高中', '为梦想奋斗的岁月', NULL, '#4ade80', 'student', 0, 4, 1),
(2020, '大学', '计算机科学专业学习', '掌握Java全栈开发', '#3b82f6', 'college', 0, 5, 1),
(2024, '工作', '全栈开发工程师', '参与多个企业级项目', '#8b5cf6', 'worker', 0, 6, 1),
(2026, '现在', '持续成长中', '打造个人技术品牌', '#ec4899', 'now', 1, 7, 1),
(2030, '未来', '技术引领未来', NULL, '#06b6d4', 'future', 0, 8, 1);

-- 初始化广西景点
INSERT INTO `b_scenic_spot` (`name`, `description`, `image`, `location`, `rating`, `tags`, `sort`, `status`) VALUES
('桂林山水', '山水甲天下，世界自然遗产', 'https://picsum.photos/seed/guilin/800/450', '广西桂林', 4.9, '["山水","5A","世界遗产"]', 1, 1),
('德天瀑布', '亚洲第一大跨国瀑布', 'https://picsum.photos/seed/detian/800/450', '广西崇左', 4.8, '["瀑布","5A","边境"]', 2, 1),
('北海银滩', '天下第一滩，细腻白沙', 'https://picsum.photos/seed/beihai/800/450', '广西北海', 4.6, '["海滩","4A","度假"]', 3, 1),
('龙脊梯田', '世界梯田原乡，壮美画卷', 'https://picsum.photos/seed/longji/800/450', '广西桂林龙胜', 4.7, '["梯田","4A","人文"]', 4, 1),
('黄姚古镇', '中国最美十大古镇之一', 'https://picsum.photos/seed/huangyao/800/450', '广西贺州', 4.5, '["古镇","4A","历史"]', 5, 1),
('阳朔西街', '地球村，中西文化交融', 'https://picsum.photos/seed/yangshuo/800/450', '广西桂林阳朔', 4.4, '["街区","文化","美食"]', 6, 1),
('涠洲岛', '中国最年轻的火山岛', 'https://picsum.photos/seed/weizhou/800/450', '广西北海', 4.7, '["海岛","5A","火山"]', 7, 1),
('巴马长寿村', '世界长寿之乡', 'https://picsum.photos/seed/bama/800/450', '广西河池', 4.3, '["养生","长寿","自然"]', 8, 1),
('两江四湖', '桂林城徽，夜游胜地', 'https://picsum.photos/seed/liangjiang/800/450', '广西桂林', 4.5, '["湖泊","夜景","城市"]', 9, 1),
('象鼻山', '桂林城徽，标志性景观', 'https://picsum.photos/seed/xiangbi/800/450', '广西桂林', 4.6, '["山水","5A","地标"]', 10, 1);

-- 初始化系统配置
INSERT INTO `b_config` (`config_key`, `config_value`, `config_type`, `description`) VALUES
('site_name', 'Mayekun', 'basic', '网站名称'),
('site_url', 'https://mayekun.com', 'basic', '网站地址'),
('site_description', '每一段成长都会有新的热爱', 'basic', '网站描述'),
('site_keywords', '博客,技术,前端,后端,Vue,Java,Spring', 'basic', '网站关键词'),
('site_icp', '桂ICP备2024029466号-3', 'basic', 'ICP备案号'),
('article_copyright', '本站内容均为原创首发，未经许可，不允许转载。', 'article', '文章版权声明'),
('defaulb_season', 'auto', 'display', '默认季节(auto:自动检测/spring/summer/autumn/winter)'),
('show_couplet', 'false', 'display', '是否显示对联(true/false)'),
('scenic_auto_approve', 'false', 'scenic', '景点推荐是否自动审核通过(true/false)');

-- 初始化管理员
INSERT INTO `b_user` (`username`, `password`, `nickname`, `role`, `status`) VALUES
('admin', '$2a$10$encrypted_password_here', '马业坤', 'admin', 1);
