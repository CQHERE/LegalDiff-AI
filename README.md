## 介绍

文档智能比对分析工具 - 一款专业的法律交易文件差异分析工具，帮助您快速发现两个文档之间的差异，并通过 AI 智能分析理解这些变化的法律意义和商业影响。

### 核心功能

- 📄 **文档上传**：支持 .doc 和 .docx 格式文档
- 🔍 **智能比对**：自动识别新增、删除、修改三种差异类型
- 🎨 **可视化展示**：左右对照显示，差异高亮标注
- 🤖 **AI 分析**：基于金融法律专业背景的智能分析
  - 总体分析：从法律合规角度总结整体变更
  - 单点分析：深入分析每个差异的法律影响
- ⚠️ **风险提示**：自动识别潜在法律风险
- ⚡ **高速响应**：使用 ernie-3.5-8k 模型，5-10 秒完成分析

### 适用场景

- 📋 合同条款变更审查
- 📝 法律文件版本对比
- 💼 商业协议修订分析
- 🔒 合规性文档审核
- 📊 交易文件差异检查

## 目录结构

```
├── README.md # 说明文档
├── components.json # 组件库配置
├── eslint.config.js # eslint 配置
├── index.html # 入口文件
├── package.json # 包管理
├── postcss.config.js # postcss 配置
├── public # 静态资源目录
│   ├── favicon.png # 图标
│   └── images # 图片资源
├── src # 源码目录
│   ├── App.tsx # 入口文件
│   ├── components # 组件目录
│   ├── context # 上下文目录
│   ├── db # 数据库配置目录
│   ├── hooks # 通用钩子函数目录
│   ├── index.css # 全局样式
│   ├── layout # 布局目录
│   ├── lib # 工具库目录
│   ├── main.tsx # 入口文件
│   ├── routes.tsx # 路由配置
│   ├── pages # 页面目录
│   ├── services  # 数据库交互目录
│   ├── types   # 类型定义目录
├── tsconfig.app.json  # ts 前端配置文件
├── tsconfig.json # ts 配置文件
├── tsconfig.node.json # ts node端配置文件
└── vite.config.ts # vite 配置文件
```

## 技术栈

Vite、TypeScript、React、Supabase

## 本地开发

### 如何在本地编辑代码？

您可以选择 [VSCode](https://code.visualstudio.com/Download) 或者您常用的任何 IDE 编辑器，唯一的要求是安装 Node.js 和 npm.

### 环境要求

```
# Node.js ≥ 20
# npm ≥ 10
例如：
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

具体安装步骤如下：

### 在 Windows 上安装 Node.js

```
# Step 1: 访问Node.js官网：https://nodejs.org/，点击下载后，会根据你的系统自动选择合适的版本（32位或64位）。
# Step 2: 运行安装程序：下载完成后，双击运行安装程序。
# Step 3: 完成安装：按照安装向导完成安装过程。
# Step 4: 验证安装：在命令提示符（cmd）或IDE终端（terminal）中输入 node -v 和 npm -v 来检查 Node.js 和 npm 是否正确安装。
```

### 在 macOS 上安装 Node.js

```
# Step 1: 使用Homebrew安装（推荐方法）：打开终端。输入命令brew install node并回车。如果尚未安装Homebrew，需要先安装Homebrew，
可以通过在终端中运行如下命令来安装：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
或者使用官网安装程序：访问Node.js官网。下载macOS的.pkg安装包。打开下载的.pkg文件，按照提示完成安装。
# Step 2: 验证安装：在命令提示符（cmd）或IDE终端（terminal）中输入 node -v 和 npm -v 来检查 Node.js 和 npm 是否正确安装。
```

### 安装完后按照如下步骤操作：

```
# Step 1: 下载代码包
# Step 2: 解压代码包
# Step 3: 用IDE打开代码包，进入代码目录
# Step 4: IDE终端输入命令行，安装依赖：npm i
# Step 5: 配置 API 密钥（重要！）
# Step 6: IDE终端输入命令行，启动开发服务器：npm run dev -- --host 127.0.0.1
```

### ⚠️ 重要：配置百度文心一言 API 密钥

本工具使用百度文心一言 API 进行 AI 分析，**必须先配置 API 密钥才能使用 AI 分析功能**。

#### 快速配置步骤：

1. **获取 API 密钥**
   - 访问 [百度智能云千帆平台](https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application)
   - 注册并登录账号
   - 创建应用，获取 API Key 和 Secret Key

2. **配置密钥**
   - 打开项目根目录下的 `.env` 文件
   - 找到以下两行：
     ```env
     VITE_ERNIE_API_KEY=your_api_key_here
     VITE_ERNIE_SECRET_KEY=your_secret_key_here
     ```
   - 将 `your_api_key_here` 替换为您的 API Key
   - 将 `your_secret_key_here` 替换为您的 Secret Key
   - 保存文件

3. **重启应用**
   - 如果应用正在运行，请重启
   - 配置生效后即可使用 AI 分析功能

#### 详细配置指南：

请查看 [API 配置说明文档](./docs/API配置说明.md)，了解：
- 📋 详细的获取步骤
- ⚙️ 配置方法
- ✅ 验证方法
- 💰 费用说明
- 🔒 安全建议
- 🐛 常见问题解答

### 如何开发后端服务？

配置环境变量，安装相关依赖
如需使用数据库，请使用 supabase 官方版本或自行部署开源版本的 Supabase

### 如何配置应用中的三方 API？

具体三方 API 调用方法，请参考帮助文档：[源码导出](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7)，了解更多详细内容。

## 了解更多

### 📚 项目文档

- 📖 [用户使用指南](./docs/用户使用指南.md) - 完整的使用教程和常见问题
- 🔧 [API 配置说明](./docs/API配置说明.md) - 详细的 API 配置步骤
- ⚡ [性能优化说明](./docs/性能优化说明.md) - 性能优化措施和效果
- 🐛 [Bug 修复报告](./docs/Bug修复报告-v2.2.1.md) - 最新的 Bug 修复记录
- 📝 [更新日志](./docs/v2.2.0更新日志.md) - 版本更新历史
- ✅ [测试清单](./docs/测试清单.md) - 功能测试清单
- 📊 [代码审查报告](./docs/代码审查报告.md) - 代码质量分析

### 🎯 快速链接

- [百度智能云千帆平台](https://console.bce.baidu.com/qianfan/overview)
- [文心一言 API 文档](https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html)
- [秒哒帮助文档](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7)

### 📞 获取帮助

如有问题，请查看：
1. [用户使用指南](./docs/用户使用指南.md) - 常见问题解答
2. [API 配置说明](./docs/API配置说明.md) - 配置相关问题
3. [秒哒帮助文档](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7) - 更多技术支持

---

**当前版本**：v2.2.1  
**更新日期**：2025-11-17  
**技术栈**：React + TypeScript + Vite + 百度文心一言 API
