# 如何配置 API 密钥

## 🎯 快速配置（推荐）

### 方法 1：使用可视化配置页面

1. **访问配置页面**
   - 启动应用后，点击右上角的"API 配置"按钮
   - 或直接访问：http://127.0.0.1:5173/config

2. **按照页面指引操作**
   - 点击"打开千帆平台应用控制台"获取 API 密钥
   - 填写 API Key 和 Secret Key
   - 点击"复制配置内容"
   - 按照提示将内容粘贴到 .env 文件
   - 重启应用

---

## 📁 .env 文件位置

**.env 文件在项目根目录**：

```
/workspace/app-7m0ueu4u3lz5/.env
```

**注意**：.env 文件是隐藏文件（以 `.` 开头），在某些文件管理器中需要显示隐藏文件才能看到。

### 如何显示隐藏文件？

**Windows**：
- 打开文件资源管理器
- 点击"查看"选项卡
- 勾选"隐藏的项目"

**macOS**：
- 在 Finder 中按 `Command + Shift + .`

**Linux**：
- 在文件管理器中按 `Ctrl + H`

**VS Code / IDE**：
- 隐藏文件默认显示，无需额外设置

---

## ✏️ 手动编辑 .env 文件

### 步骤 1：打开 .env 文件

使用任何文本编辑器打开 `/workspace/app-7m0ueu4u3lz5/.env` 文件

### 步骤 2：填写 API 密钥

将文件内容修改为：

```env
VITE_APP_ID=app-7m0ueu4u3lz5

# 百度文心一言 API 密钥
VITE_ERNIE_API_KEY=你的API_Key
VITE_ERNIE_SECRET_KEY=你的Secret_Key
```

**重要**：
- 将 `你的API_Key` 替换为您从百度千帆平台获取的真实 API Key
- 将 `你的Secret_Key` 替换为您从百度千帆平台获取的真实 Secret Key
- 不要保留 `your_api_key_here` 这样的示例值

### 步骤 3：保存文件

保存 .env 文件

### 步骤 4：重启应用

在终端中：
1. 停止当前运行的应用（按 `Ctrl+C`）
2. 重新启动：`npm run dev -- --host 127.0.0.1`

---

## 🔑 如何获取 API 密钥？

### 步骤 1：访问百度智能云

访问：https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application

### 步骤 2：注册/登录

- 如果没有账号，先注册
- 如果有账号，直接登录

### 步骤 3：创建应用

1. 点击"创建应用"
2. 填写应用信息：
   - 应用名称：文档比对分析工具（或自定义）
   - 应用描述：用于文档差异分析
   - 应用类型：自用
3. 点击"确定"

### 步骤 4：获取密钥

1. 在应用列表中找到刚创建的应用
2. 点击"查看"或"管理"
3. 复制 **API Key** 和 **Secret Key**

---

## ✅ 验证配置

### 方法 1：使用应用验证

1. 启动应用
2. 上传两个文档
3. 点击"开始比对"
4. 如果看到 AI 分析结果，说明配置成功 ✅

### 方法 2：检查错误提示

如果配置错误，会显示以下提示之一：

**未配置密钥**：
```
请先配置百度文心一言 API 密钥
（在 .env 文件中设置 VITE_ERNIE_API_KEY 和 VITE_ERNIE_SECRET_KEY）
```

**密钥无效**：
```
API 错误 (110): Access token invalid or no longer valid
```

---

## 🐛 常见问题

### Q1：找不到 .env 文件

**解决方法**：
1. 确认您在项目根目录 `/workspace/app-7m0ueu4u3lz5/`
2. 显示隐藏文件（参考上面的说明）
3. 如果还是找不到，可以手动创建一个新的 .env 文件

### Q2：配置后仍然提示"请先配置 API 密钥"

**解决方法**：
1. 检查 .env 文件内容是否正确
2. 确认没有多余的空格或引号
3. 重启应用（必须重启才能生效）

### Q3：提示"Access token invalid"

**解决方法**：
1. 检查 API Key 和 Secret Key 是否正确
2. 确认复制时没有遗漏字符
3. 尝试重新生成密钥

### Q4：配置后应用无法启动

**解决方法**：
1. 检查 .env 文件格式是否正确
2. 确认没有语法错误
3. 参考本文档的示例格式

---

## 💡 配置示例

### 正确的配置格式

```env
VITE_APP_ID=app-7m0ueu4u3lz5

# 百度文心一言 API 密钥
VITE_ERNIE_API_KEY=abcdefghijklmnopqrstuvwxyz123456
VITE_ERNIE_SECRET_KEY=1234567890abcdefghijklmnopqrstuv
```

### 错误的配置格式

```env
# ❌ 错误：有引号
VITE_ERNIE_API_KEY="abcdefghijklmnopqrstuvwxyz123456"

# ❌ 错误：有空格
VITE_ERNIE_API_KEY = abcdefghijklmnopqrstuvwxyz123456

# ❌ 错误：使用示例值
VITE_ERNIE_API_KEY=your_api_key_here
```

---

## 📞 需要帮助？

如果您在配置过程中遇到问题，请查看：

1. [API 配置说明](./API配置说明.md) - 详细的配置文档
2. [用户使用指南](./用户使用指南.md) - 完整的使用教程
3. [Bug 修复报告](./Bug修复报告-v2.2.1.md) - 常见问题解决方案

---

**配置完成后，您就可以使用 AI 分析功能了！** 🎉
