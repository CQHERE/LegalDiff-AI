# API 配置说明

## 📋 概述

本文档智能比对分析工具使用 **硅基流动（SiliconFlow）的 DeepSeek 模型** 进行 AI 分析。开始使用前，需要先在控制台创建 API Key 并写入 `.env` 文件。

---

## 🔑 获取 API 密钥

### 步骤 1：注册硅基流动账号

1. 访问 [https://cloud.siliconflow.cn/](https://cloud.siliconflow.cn/)
2. 点击“注册”，完成手机号/邮箱验证
3. 按提示完成实名认证（企业或个人均可）

### 步骤 2：开通 DeepSeek 模型

1. 登录控制台，进入“模型广场”
2. 找到 DeepSeek 系列模型（如 `deepseek-ai/DeepSeek-V3.2-Exp`、`deepseek-reasoner`）
3. 点击“开通”并勾选所需模型

### 步骤 3：创建 API Key

1. 打开“API 密钥”或“密钥管理”页面
2. 点击“创建 API Key”
3. 复制新生成的 Key（只显示一次）

**重要提示**：
- ⚠️ API Key 具有账号权限，请妥善保存
- ⚠️ 不要将 Key 提交到公共仓库
- ⚠️ 遗失或泄露后请及时在控制台删除并重新生成

---

## ⚙️ 配置 API 密钥

### 方法 1：修改 .env 文件（推荐）

1. 打开项目根目录下的 `.env` 文件
2. 添加或修改以下内容：
   ```env
   VITE_DEEPSEEK_API_KEY=sk_xxx
   VITE_DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3.2-Exp
   ```
3. 将 `sk_xxx` 替换为您实际的 API Key
4. 如需切换模型，只需调整 `VITE_DEEPSEEK_MODEL`
5. 保存文件

### 方法 2：使用环境变量

如果使用 CI/CD 或云服务器部署，可直接注入环境变量：

```bash
export VITE_DEEPSEEK_API_KEY=sk_xxx
export VITE_DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3.2-Exp
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
请先配置硅基流动 DeepSeek API 密钥（VITE_DEEPSEEK_API_KEY）
```

**解决方法**：
- 检查 `.env` 中是否已写入 `VITE_DEEPSEEK_API_KEY`
- 修改后记得重启开发服务器

**错误 2：鉴权失败 / 模型未开通**
```
AI 分析请求失败 (401): invalid authentication credentials
```

**解决方法**：
- 确认 Key 是否正确、未过期
- 检查 `VITE_DEEPSEEK_MODEL` 是否已经在控制台开通
- 若为付费模型，请确认账户余额充足

**错误 3：API 调用失败**
```
AI 分析请求失败 (401): Unauthorized
```

**解决方法**：
- 检查账号是否开通了 DeepSeek 模型
- 检查应用是否正常启用
- 检查账号余额是否充足

---

## 💰 费用说明

### 免费额度

硅基流动为 DeepSeek 模型提供免费/优惠额度：
- **新用户**：注册后可获得一定的 DeepSeek 体验额度
- **每日限额**：免费模型有 QPS/调用次数限制

### 计费方式

超出免费额度后，按照以下方式计费：
- **按调用次数**：每次 API 调用收费
- **按 Token 数量**：根据输入和输出的 Token 数量计费

**常用模型**：`deepseek-ai/DeepSeek-V3.2-Exp` / `deepseek-reasoner`
- **价格**：参考硅基流动官网（约 ¥0.006~0.02 / 千 Token）
- **预估成本**：
  - 总体分析：≈ ¥0.01/次（视差异长度而定）
  - 单点分析：≈ ¥0.003-0.008/次

### 查看用量

1. 访问 [硅基流动控制台](https://cloud.siliconflow.cn/)
2. 进入「用量统计 / 账单」
3. 查看当日调用次数与费用

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
   VITE_DEEPSEEK_API_KEY=sk_xxx
   
   # ❌ 错误（有引号）
   VITE_DEEPSEEK_API_KEY="sk_xxx"
   
   # ❌ 错误（有空格）
   VITE_DEEPSEEK_API_KEY = sk_xxx
   ```

---

### Q2：提示"invalid authentication credentials"

**可能原因**：
1. API Key 失效或填写错误
2. 请求的模型未授权
3. 账号余额不足

**解决方法**：
1. 在控制台重新复制 API Key
2. 确认 `VITE_DEEPSEEK_MODEL` 已开通
3. 补充账户余额或切换免费模型

---

### Q3：提示"Insufficient balance"

**可能原因**：
- 账号余额不足或免费额度用完

**解决方法**：
1. 访问硅基流动控制台查看余额
2. 充值或等待免费额度重置
3. 优化使用频率，减少不必要的调用

---

### Q4：分析速度很慢

**可能原因**：
1. 网络连接不稳定或命中限流
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

- [硅基流动官方文档](https://docs.siliconflow.cn/)
- [DeepSeek API 参考](https://docs.siliconflow.cn/api-reference/)
- [常见问题](https://docs.siliconflow.cn/faq)

### 技术支持

- 📧 硅基流动工单系统
- 💬 官方企业微信 / 在线客服
- 📱 技术支持热线

### 社区支持

- 💻 GitHub Issues
- 💬 开发者论坛
- 📚 技术博客

---

## 📝 配置检查清单

在开始使用前，请确认以下事项：

- [ ] 已注册硅基流动账号
- [ ] 已开通 DeepSeek 模型调用权限
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
