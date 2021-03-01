# [NJU侠预约系统](https://nju.itxia.cn)

南京大学IT侠预约系统代码库。

## 项目概况

自我加入IT侠以来，不时听到社团同学说旧预约系统不够人性化，时常有bug。（例如有同学预约时网络卡顿导致一下出现十几个重复预约单；无法查看另一个校区；附件全部损坏；甚至密码还是明文存储，也没有修改的页面...）

大家看了代码，发现几乎无法维护：前后端不分离，没有版本管理，弱类型python代码可读性极差，数据库设计不明。

本项目就是为了取代旧预约系统，打造一个**人性化、好用**的预约系统。
并从技术上革新，实现高可扩展性、可维护性，便于后人开发和维护。

自2020年6月上线以来，功能、界面、响应速度等等各方面都得到社团成员的肯定👍👍👍。

## 特性

很多有意思的地方，详见[Features.md](FEATURES.md)。

## 技术性概述
本项目目前有三个子项目。
```
.
└── projects
    ├── api-service     # 后端API服务
    ├── proxy-server    # 代理服务器(计划移除)
    └── spa-website     # 前端
```

### 单页应用前端

使用React框架、Antd UI组件库构建的单页应用。

```
└── src
    ├── components      # 私有组件
    ├── config          # 配置文件
    ├── context         # React Context
    ├── hook            # 自己封装的许多React Hook
    ├── page            # 按照路由来组织的页面
    ├── request         # 网络请求util
    ├── theme           # 适配暗黑模式主题
    └── util            # 通用工具
```

技术亮点：
- 全部由TypeScript编写。
- 自行实现了许多有趣的功能。（见[Features.md](FEATURES.md)）
- 喜欢自己造轮子，并封装了许多常用的React Hook，如useApiRequest, useDebounce等等。
- 注重代码质量、可扩展性、可维护性。全部源代码仅6000+LOC。
- 极少出bug😊

### API服务

使用Kotlin编写的SpringBoot项目，为前端提供Rest API服务。

```
src/main/
├── kotlin
│   └── cn
│       └── itxia
│           └── api
│               ├── advice      # 切面、错误处理器
│               ├── annotation  # 自定义注解
│               ├── config      # WebMvc配置
│               ├── controller  # Controller
│               ├── dto         # RequestBody classes
│               ├── enum        # 枚举类型
│               ├── filter      # Servlet Filter
│               ├── model       # 数据库model、Repository
│               ├── response    # 包装返回值为统一格式
│               ├── service     # Services业务逻辑
│               ├── util        # 工具类
│               └── vo          # ResponseBody classes
└── resources                   # 配置文件
```

此外，还集成了其他服务：
- MongoDB数据库用于数据存储。
- QQ OAuth服务实现QQ登录。
- 阿里云邮件服务实现邮件提醒功能。

### Proxy Server

HTTP代理服务器，同时具有监控、日志功能。

## 功能列表

### 通用功能
- 深色模式。（适配iOS）
- BackTop。
- 路由和导航栏。

### 预约系统

- **发起预约**：填写预约单，发起预约。
- **查看预约单**：查看预约单，向IT侠回复消息。也可取消预约。
- **公告**：查看最近发布的公告。
- **邮件提醒**：有新回复消息时发送邮件提醒。

### 后台系统

- **主页**：查看（后台）公告、预约单统计信息。
- **预约单**：查看、接单、完成预约单。
- **预约单讨论区**：对预约单进行讨论，向客户（预约人）回复消息。
- **经验记录页面**：写维修心得、经验、翻车教训、~~文学抒情~~，并提供收藏、标签检索。
- **公告管理**：公告的发布、编辑、排序。
- **个人信息**：个人信息的查看、修改。
- **通过QQ登录**：QQ OAuth登录及绑定。
- **成员账号管理**：查看所有成员的账号信息，可启用禁用、修改密码、更改权限。
- **邀请加入**：通过邀请码邀请成员加入。
- **邮件提醒**：本校区有新预约单时、我的接单有新回复时发送邮件提醒。

## 开发文档

(需要加入内部语雀用户组)

请参考[语雀文档](https://www.yuque.com/itxiaadmin/gitbook-lyh50o/vv0z15)。

