# API 配置说明

## 📋 概述

本文档智能比对分析工具使用百度文心一言 API 进行 AI 分析。在使用前，您需要先配置 API 密钥。

---

## 🔑 获取 API 密钥

### 步骤 1：注册百度智能云账号

1. 访问 [百度智能云](https://cloud.baidu.com/)
2. 点击右上角"注册"按钮
3. 按照提示完成账号注册

### 步骤 2：开通文心一言服务

1. 登录百度智能云控制台
2. 访问 [千帆大模型平台](https://console.bce.baidu.com/qianfan/overview)
3. 点击"立即使用"开通服务
4. 完成实名认证（如需要）

### 步骤 3：创建应用

1. 访问 [应用接入](https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application)
2. 点击"创建应用"按钮
3. 填写应用信息：
   - **应用名称**：文档比对分析工具（或自定义）
   - **应用描述**：用于文档差异分析和 AI 智能分析
   - **应用类型**：选择"自用"
4. 点击"确定"创建应用

### 步骤 4：获取 API 密钥

1. 在应用列表中找到刚创建的应用
2. 点击"查看"或"管理"
3. 复制以下信息：
   - **API Key**（也叫 Client ID）
   - **Secret Key**（也叫 Client Secret）

**重要提示**：
- ⚠️ 请妥善保管 API 密钥，不要泄露给他人
- ⚠️ 不要将密钥提交到公开的代码仓库
- ⚠️ 如果密钥泄露，请立即重置

---

## ⚙️ 配置 API 密钥

### 方法 1：修改 .env 文件（推荐）

1. 打开项目根目录下的 `.env` 文件
2. 找到以下两行：
   ```env
   VITE_ERNIE_API_KEY=your_api_key_here
   VITE_ERNIE_SECRET_KEY=your_secret_key_here
   ```
3. 将 `your_api_key_here` 替换为您的 API Key
4. 将 `your_secret_key_here` 替换为您的 Secret Key
5. 保存文件

**示例**：
```env
VITE_ERNIE_API_KEY=abcdefghijklmnopqrstuvwxyz123456
VITE_ERNIE_SECRET_KEY=1234567890abcdefghijklmnopqrstuv
```

### 方法 2：使用环境变量

如果您使用的是服务器部署，可以直接设置环境变量：

```bash
export VITE_ERNIE_API_KEY=your_api_key_here
export VITE_ERNIE_SECRET_KEY=your_secret_key_here
```

---

## ✅ 验证配置

### 步骤 1：重启应用

配置完成后，需要重启应用以使配置生效：

```bash
# 如果正在运行，先停止
# 然后重新启动
npm run dev
```

### 步骤 2：测试 AI 分析

1. 上传两个文档
2. 点击"开始比对"
3. 等待总体分析结果
4. 如果看到 AI 分析结果，说明配置成功 ✅

### 步骤 3：检查错误信息

如果配置失败，会显示以下错误信息：

**错误 1：未配置 API 密钥**
```
请先配置百度文心一言 API 密钥
（在 .env 文件中设置 VITE_ERNIE_API_KEY 和 VITE_ERNIE_SECRET_KEY）
```

**解决方法**：
- 检查 `.env` 文件是否存在
- 检查密钥是否正确填写
- 检查是否重启了应用

**错误 2：API 密钥无效**
```
API 错误 (110): Access token invalid or no longer valid
```

**解决方法**：
- 检查 API Key 和 Secret Key 是否正确
- 检查是否复制了完整的密钥（没有多余的空格）
- 尝试重新生成密钥

**错误 3：API 调用失败**
```
AI 分析请求失败 (401): Unauthorized
```

**解决方法**：
- 检查账号是否开通了文心一言服务
- 检查应用是否正常启用
- 检查账号余额是否充足

---

## 💰 费用说明

### 免费额度

百度文心一言提供免费试用额度：
- **新用户**：赠送一定额度的免费调用次数
- **每日限额**：免费用户有每日调用次数限制

### 计费方式

超出免费额度后，按照以下方式计费：
- **按调用次数**：每次 API 调用收费
- **按 Token 数量**：根据输入和输出的 Token 数量计费

**本工具使用的模型**：ernie-3.5-8k
- **价格**：约 ¥0.008/千 Token（具体以官网为准）
- **预估成本**：
  - 总体分析：约 ¥0.01-0.02/次
  - 单点分析：约 ¥0.005-0.01/次

### 查看用量

1. 访问 [千帆控制台](https://console.bce.baidu.com/qianfan/overview)
2. 点击"用量统计"
3. 查看 API 调用次数和费用

---

## 🔒 安全建议

### 1. 保护 API 密钥

- ✅ 使用 `.env` 文件存储密钥
- ✅ 将 `.env` 添加到 `.gitignore`
- ✅ 不要在代码中硬编码密钥
- ✅ 不要将密钥提交到公开仓库

### 2. 限制访问权限

- ✅ 只在必要的环境中配置密钥
- ✅ 定期更换密钥
- ✅ 为不同环境使用不同的密钥

### 3. 监控使用情况

- ✅ 定期检查 API 调用量
- ✅ 设置用量告警
- ✅ 及时发现异常调用

---

## 🐛 常见问题

### Q1：配置后仍然提示"请先配置 API 密钥"

**可能原因**：
1. 没有重启应用
2. `.env` 文件格式错误
3. 密钥中包含多余的空格或引号

**解决方法**：
1. 重启应用
2. 检查 `.env` 文件格式：
   ```env
   # ✅ 正确
   VITE_ERNIE_API_KEY=abcdefg123456
   
   # ❌ 错误（有引号）
   VITE_ERNIE_API_KEY="abcdefg123456"
   
   # ❌ 错误（有空格）
   VITE_ERNIE_API_KEY = abcdefg123456
   ```

---

### Q2：提示"Access token invalid"

**可能原因**：
1. API Key 或 Secret Key 错误
2. 密钥已过期或被重置
3. 应用被禁用

**解决方法**：
1. 重新复制密钥，确保完整无误
2. 检查应用状态是否正常
3. 尝试重新生成密钥

---

### Q3：提示"Insufficient balance"

**可能原因**：
- 账号余额不足或免费额度用完

**解决方法**：
1. 访问控制台查看余额
2. 充值或等待免费额度重置
3. 优化使用频率，减少不必要的调用

---

### Q4：分析速度很慢

**可能原因**：
1. 网络连接不稳定
2. API 服务器负载高
3. 文档内容过长

**解决方法**：
1. 检查网络连接
2. 避免在高峰期使用
3. 减少文档大小

---

### Q5：如何切换到其他 AI 模型？

**当前使用**：ernie-3.5-8k（速度快，成本低）

**可选模型**：
- **ernie-4.0-turbo-8k**：质量更高，速度较慢，成本较高
- **ernie-lite-8k**：速度极快，质量中等，成本最低

**切换方法**：
1. 打开 `src/pages/SamplePage.tsx`
2. 找到以下代码：
   ```typescript
   const response = await fetch(
     `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k?access_token=${accessToken}`,
     // ...
   );
   ```
3. 将 `ernie-3.5-8k` 替换为其他模型名称
4. 保存并重启应用

---

## 📞 获取帮助

### 官方文档

- [千帆大模型平台文档](https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html)
- [API 接口文档](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/jlil56u11)
- [常见问题](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Nlks5zkzu)

### 技术支持

- 📧 百度智能云工单系统
- 💬 在线客服
- 📱 技术支持热线

### 社区支持

- 💻 GitHub Issues
- 💬 开发者论坛
- 📚 技术博客

---

## 📝 配置检查清单

在开始使用前，请确认以下事项：

- [ ] 已注册百度智能云账号
- [ ] 已开通千帆大模型平台服务
- [ ] 已创建应用并获取 API 密钥
- [ ] 已在 `.env` 文件中配置密钥
- [ ] 已重启应用使配置生效
- [ ] 已测试 AI 分析功能正常工作
- [ ] 已了解费用和计费方式
- [ ] 已设置用量告警（可选）

---

**文档版本**：v2.2.0  
**更新日期**：2025-11-17  
**适用版本**：所有版本
