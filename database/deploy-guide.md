# Mayekun Blog 后端部署完善文档

> 基于 SmartAdmin 部署指南，对照当前 prod 配置的检查清单

---

## 一、服务器环境要求

| 软件 | 版本要求 | 说明 |
|------|---------|------|
| Java | 17+ | 项目使用 Spring Boot 3 + Java 17 |
| MySQL | 5.7+ | 推荐 8.0 |
| Redis | 5.0+ | 生产环境必须设置密码 |
| Nginx | 1.18+ | 反向代理 + 静态文件 |
| Maven | 3.6+ | 打包用 |

---

## 二、prod 配置文件修改清单

配置文件路径：`sa-base/src/main/resources/prod/sa-base.yaml`

### 2.1 数据库连接（必改）

```yaml
spring:
  datasource:
    # 改为服务器实际数据库地址和库名
    url: jdbc:mysql://127.0.0.1:3306/mayekun_blog?autoReconnect=true&useServerPreparedStmts=false&rewriteBatchedStatements=true&characterEncoding=UTF-8&useSSL=false&allowMultiQueries=true&serverTimezone=Asia/Shanghai
    # 改为服务器实际数据库账号
    username: root
    # 改为服务器实际数据库密码（当前默认值 SmartAdmin666 不安全）
    password: <你的数据库密码>
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**注意**：数据库名从 `smart_admin_v3` 改为 `mayekun_blog`（或你实际使用的数据库名）

### 2.2 Redis 连接（必改）

```yaml
spring:
  data:
    redis:
      database: 1
      host: 127.0.0.1
      port: 6379
      # 生产环境必须设置密码（当前为空）
      password: <你的Redis密码>
```

### 2.3 关闭 Swagger/Knife4j（必改）

生产环境不应暴露 API 文档，当前 prod 配置中 Swagger 是开启的，需关闭：

```yaml
# open api配置
springdoc:
  swagger-ui:
    enabled: false  # true → false
  api-docs:
    enabled: false  # true → false
knife4j:
  enable: false     # true → false
  basic:
    enable: false
```

### 2.4 文件上传路径（按需修改）

```yaml
file:
  storage:
    mode: local
    local:
      # 改为服务器实际的上传目录，确保目录存在且有写权限
      upload-path: /home/mayekun/upload/
      url-prefix:
```

部署后需在服务器上创建目录：
```bash
mkdir -p /home/mayekun/upload/
chmod 755 /home/mayekun/upload/
```

### 2.5 邮件配置（按需修改）

如需邮件功能，改为自己的 SMTP 服务：

```yaml
spring:
  mail:
    host: smtp.163.com        # 改为你的 SMTP 服务器
    port: 465
    username: <你的邮箱>       # 当前默认 lab1024@163.com
    password: <你的邮箱密码>   # 当前默认 LAB1024LAB
```

如不需要邮件功能，可忽略。

### 2.6 Druid 监控（已默认关闭）

当前 prod 配置 `druid.login.enabled: false`，无需修改。

---

## 三、sa-admin prod 配置

配置文件路径：`sa-admin/src/main/resources/prod/application.yaml`

当前配置已合理，一般无需修改：

```yaml
project:
  name: sa-admin
  log-directory: /home/logs/smart_admin_v3/${project.name}/${spring.profiles.active}

server:
  port: 1024
  servlet:
    context-path: /
```

如需修改日志目录，改为：
```yaml
project:
  name: sa-admin
  log-directory: /home/logs/mayekun/${project.name}/${spring.profiles.active}
```

---

## 四、log4j2 日志级别

配置文件路径：`sa-admin/src/main/resources/log4j2-spring.xml`

生产环境建议日志级别为 `warn`：

```xml
<Loggers>
  <Root level="warn">
    <AppenderRef ref="Console"/>
    <AppenderRef ref="debug"/>
    <AppenderRef ref="info"/>
    <AppenderRef ref="warn"/>
    <AppenderRef ref="error"/>
  </Root>
</Loggers>
```

---

## 五、数据库安全

### 5.1 修改万能密码

登录后台管理系统，进入 `t_config` 表，修改 `super_password` 为复杂密码。

或直接 SQL：
```sql
UPDATE t_config SET config_value = '<你的复杂密码>' WHERE config_key = 'super_password';
```

### 5.2 导入博客表结构

确保服务器数据库已导入 `mayekun_blog.sql`：
```bash
mysql -u root -p mayekun_blog < mayekun_blog.sql
```

---

## 六、打包部署

### 6.1 打包

在项目根目录执行：
```bash
mvn clean package -Dmaven.test.skip=true -P prod
```

打包产物位于：`sa-admin/target/sa-admin-prod-3.0.0.jar`

### 6.2 上传服务器

```bash
scp sa-admin/target/sa-admin-prod-3.0.0.jar user@your-server:/home/mayekun/
```

### 6.3 启动

```bash
java -server -Xms600m -Xmx600m -jar /home/mayekun/sa-admin-prod-3.0.0.jar > /home/mayekun/sa-admin-nohup.out 2>&1 &
```

### 6.4 启动脚本（推荐）

创建 `/home/mayekun/startup.sh`：

```bash
#!/bin/bash

APP_NAME=sa-admin-prod-3.0.0.jar
APP_HOME=/home/mayekun
LOG_FILE=$APP_HOME/sa-admin-nohup.out

# 停止旧进程
PID=$(ps -ef | grep java | grep $APP_NAME | grep -v grep | awk '{print $2}')
if [ -n "$PID" ]; then
  echo "停止旧进程: $PID"
  kill -9 $PID
  sleep 3
fi

# 启动新进程
nohup java -server -Xms600m -Xmx600m -jar $APP_HOME/$APP_NAME > $LOG_FILE 2>&1 &

# 检查启动
sleep 10
NEW_PID=$(ps -ef | grep java | grep $APP_NAME | grep -v grep | awk '{print $2}')
if [ -n "$NEW_PID" ]; then
  echo "启动成功, PID: $NEW_PID"
else
  echo "启动失败, 请检查日志: $LOG_FILE"
fi

# 打印最新日志
tail -n 50 $LOG_FILE
```

```bash
chmod +x /home/mayekun/startup.sh
```

---

## 七、Nginx 配置

创建 `/etc/nginx/conf.d/mayekun.conf`：

```nginx
server {
    listen 80;
    server_name mayekun.com www.mayekun.com;

    # 前端静态文件
    root /home/mayekun/dist;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:1024;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 120s;
    }

    # 上传文件访问（如果文件存储模式为 local）
    location /upload/ {
        alias /home/mayekun/upload/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 前端路由 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### HTTPS 配置（推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d mayekun.com -d www.mayekun.com
```

---

## 八、前端打包部署

### 8.1 修改 API 地址

前端 `src/api/request.ts` 中 `resolveUrl` 函数，生产环境图片路径需通过 Nginx 代理访问，无需修改。

### 8.2 打包

```bash
cd mayekun-ui
npm run build
```

### 8.3 上传

```bash
scp -r dist/* user@your-server:/home/mayekun/dist/
```

---

## 九、部署后验证清单

- [ ] 后端启动成功，日志无报错
- [ ] 访问 `http://mayekun.com/api/` 返回 404 或正常响应（非 502）
- [ ] 前端页面正常加载
- [ ] 文章列表接口 `/api/web/bArticle/queryPage` 正常返回
- [ ] 图片上传和访问正常
- [ ] Swagger 文档不可访问（`/doc.html` 返回 404）
- [ ] Druid 监控不可访问（`/druid` 返回 404）
- [ ] 后台管理系统登录正常
- [ ] HTTPS 证书有效

---

## 十、当前 prod 配置与 dev 配置差异对照

| 配置项 | dev | prod | 是否需修改 |
|--------|-----|------|-----------|
| 数据库驱动 | P6Spy（SQL日志） | MySQL 原生 | 已正确 |
| 数据库密码 | root | SmartAdmin666 | **需改为实际密码** |
| 数据库名 | smart_admin_v3 | smart_admin_v3 | **需改为 mayekun_blog** |
| Redis 密码 | redisroot | 空 | **需设置密码** |
| 连接池大小 | 2-10 | 10-200 | 已正确 |
| 跨域 | 允许（*） | 未配置 | 已正确（Nginx代理） |
| Swagger | 开启 | 开启 | **需关闭** |
| sa-token log | true | false | 已正确 |
| 日志级别 | debug | warn | 已正确 |
| 心跳间隔 | 300s | 60s | 已正确 |
| 热加载间隔 | 300s | 60s | 已正确 |
