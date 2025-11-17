# 如何配置 API 密钥

## 🎯 快速配置（推荐）

应用已内置有效的 API 密钥读取逻辑，启动后会自动从根目录下的 `.env` 文件加载凭据。若需替换为自己的密钥，只需直接编辑 `.env` 文件并重启应用即可。

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

# 硅基流动 DeepSeek API 密钥
VITE_DEEPSEEK_API_KEY=你的DeepSeek_API_Key
VITE_DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3.2-Exp
```

**重要**：
- 将 `你的DeepSeek_API_Key` 替换为您在硅基流动控制台生成的真实 API Key
- `VITE_DEEPSEEK_MODEL` 可根据账户权限切换为 `deepseek-chat`、`deepseek-r1` 等模型名称
- 不要保留示例值，保存后需重启应用

### 步骤 3：保存文件

保存 .env 文件

### 步骤 4：重启应用

在终端中：
1. 停止当前运行的应用（按 `Ctrl+C`）
2. 重新启动：`npm run dev -- --host 127.0.0.1`

---

## 🔑 如何获取 DeepSeek API 密钥？

### 步骤 1：访问硅基流动控制台

- 官网：https://cloud.siliconflow.cn/

### 步骤 2：注册/登录

1. 使用手机号或邮箱注册账号
2. 完成实名认证（企业/个人均可）
3. 登录控制台后进入「API 管理」页面

### 步骤 3：创建/查看 API Key

1. 在「密钥管理」中点击「创建 API Key」
2. 为密钥命名（如：doc-diff-tool）
3. 复制生成的 Key（仅显示一次，务必妥善保管）

### 步骤 4：选择 DeepSeek 模型

1. 进入「模型广场」> DeepSeek
2. 开通需要的模型（推荐 `deepseek-ai/DeepSeek-V3.2-Exp`，也可选择 `deepseek-reasoner` 等其他版本）
3. 在 `.env` 中将模型名称写入 `VITE_DEEPSEEK_MODEL`

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
请先配置硅基流动 DeepSeek API 密钥（.env 中设置 VITE_DEEPSEEK_API_KEY）
```

**密钥无效/权限不足**：
```
AI 分析请求失败 (401): invalid authentication credentials
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

# 硅基流动 DeepSeek API 密钥
VITE_DEEPSEEK_API_KEY=sk-your-real-key
VITE_DEEPSEEK_MODEL=deepseek-reasoner
```

### 错误的配置格式

```env
# ❌ 错误：有引号
VITE_DEEPSEEK_API_KEY="sk-xxxx"

# ❌ 错误：有空格
VITE_DEEPSEEK_API_KEY = sk-xxxx

# ❌ 错误：保留示例值
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

---

## 📞 需要帮助？

如果您在配置过程中遇到问题，请查看：

1. [API 配置说明](./API配置说明.md) - 详细的配置文档
2. [用户使用指南](./用户使用指南.md) - 完整的使用教程
3. [Bug 修复报告](./Bug修复报告-v2.2.1.md) - 常见问题解决方案

---

**配置完成后，您就可以使用 AI 分析功能了！** 🎉
