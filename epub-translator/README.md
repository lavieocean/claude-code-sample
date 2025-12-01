# 📚 EPUB Translator

一个基于Web的AI驱动的EPUB电子书翻译工具，支持 **OpenAI** 和 **Google Gemini** 翻译引擎，保持原书完整排版结构。

## ✨ 功能特点

### 核心功能
- 📖 **完整EPUB支持** - 兼容EPUB 2.0和3.0格式
- 🤖 **多引擎AI翻译**
  - **Google Gemini** - 每天1500次免费翻译（推荐！）
  - **OpenAI GPT-4o** / GPT-4o-mini
- 🎨 **保留排版** - 完整保留原书结构、样式、图片、目录
- 👁️ **三种阅读模式**
  - 原文模式
  - 译文模式
  - 中英对照模式
- 📥 **一键下载** - 生成翻译版EPUB文件

### 用户体验
- 🚀 **即开即用** - 无需安装，浏览器打开即用
- 🎯 **拖拽上传** - 支持拖拽上传或点击选择
- 📊 **实时进度** - 翻译进度可视化，支持暂停/继续
- 💰 **成本透明** - 实时显示预估翻译成本
- 🔒 **隐私保护** - API Key仅保存在本地浏览器

## 🚀 快速开始

### 1. 准备API Key

#### 方案A：Google Gemini（推荐 - 免费）

**完全免费！每天1500次翻译请求！**

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 使用Google账号登录
3. 点击 "Create API Key" 创建API Key
4. 复制API Key（格式：`AIza...`）

💡 **详细教程：** 查看 [GEMINI_GUIDE.md](./GEMINI_GUIDE.md)

#### 方案B：OpenAI（付费）

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册/登录账号
3. 进入 [API Keys](https://platform.openai.com/api-keys) 页面
4. 点击 "Create new secret key" 创建新的API Key
5. 复制并保存您的API Key（格式：`sk-...`）

**注意：** OpenAI API需要付费使用。

### 2. 使用工具

#### 方式A：在线使用（推荐）
直接用浏览器打开 `index.html` 文件即可使用。

#### 方式B：本地服务器
```bash
# 使用Python启动本地服务器
python3 -m http.server 8000

# 或使用Node.js
npx http-server
```

然后访问 `http://localhost:8000`

### 3. 配置API

1. 点击右上角 **⚙️ 设置** 按钮
2. 在 "API Key" 输入框中粘贴您的OpenAI API Key
3. 选择模型：
   - **GPT-4o-mini**（推荐）- 经济实惠，速度快
   - **GPT-4o** - 翻译质量更高，成本较高
4. 点击 **测试连接** 验证API Key是否有效
5. 配置翻译选项（语言、风格等）
6. 点击 **保存设置**

### 4. 翻译EPUB

1. **上传文件**
   - 拖拽EPUB文件到上传区域
   - 或点击 "选择文件" 按钮

2. **预览书籍**
   - 上传成功后会自动显示书籍信息
   - 左侧显示目录，点击可切换章节
   - 右侧显示章节内容

3. **开始翻译**
   - 点击左下角 **🚀 开始翻译** 按钮
   - 实时查看翻译进度
   - 可随时点击 **暂停** 按钮暂停翻译
   - 翻译过程中可切换章节查看已翻译内容

4. **切换阅读模式**
   - **原文** - 仅显示原文
   - **译文** - 仅显示翻译结果
   - **对照** - 中英对照显示

5. **下载译文**
   - 翻译完成后，点击 **📥 下载译文** 按钮
   - 自动生成并下载翻译版EPUB文件

## 📖 使用示例

### 翻译一本10万字的小说

**成本估算：**

| 模型 | 预估Token | 预估成本 |
|------|-----------|----------|
| GPT-4o | ~150,000 | $0.75 |
| GPT-4o-mini | ~150,000 | $0.03 |

**翻译时间：**
- 约1000段落
- 每段约0.5秒（包括API调用和延迟）
- 总时间：约8-10分钟

## ⚙️ 翻译设置说明

### 源语言
- **自动检测**（推荐）- 自动识别原文语言
- 或手动选择：English, 日本語, 한국어, Français等

### 目标语言
- **简体中文**（默认）
- 繁體中文
- English
- 日本語

### 翻译风格
- **忠实原文（直译）** - 严格按照原文翻译，适合技术文档
- **流畅易读（意译）**（推荐）- 符合中文阅读习惯，适合小说
- **文学性翻译** - 注重语言美感，适合文学作品

## 🔧 技术架构

### 技术栈
- **前端框架**：纯原生 JavaScript（无依赖）
- **EPUB解析**：JSZip (3.10.1)
- **AI引擎**：OpenAI GPT-4o / GPT-4o-mini
- **本地存储**：LocalStorage

### 文件结构
```
epub-translator/
├── index.html          # 主页面
├── styles.css          # 样式表
├── app.js              # 核心应用逻辑
└── README.md           # 使用文档
```

### 工作流程
```
1. 上传EPUB → JSZip解析
2. 提取章节内容 → 解析HTML
3. 按段落分割 → 发送OpenAI API
4. 接收翻译结果 → 实时渲染
5. 重新打包EPUB → 下载文件
```

## 🛡️ 隐私与安全

- ✅ **API Key本地存储** - 仅保存在浏览器LocalStorage，不上传服务器
- ✅ **文件本地处理** - EPUB文件在浏览器中解析，不上传任何服务器
- ✅ **开源透明** - 所有代码开源，可审查
- ⚠️ **注意**：翻译内容会发送到OpenAI服务器进行处理

## ⚠️ 使用限制

### 文件大小
- 最大支持：50MB
- 建议大小：< 10MB

### API限制
- 受OpenAI API速率限制约束
- 每段翻译间隔200ms避免限流
- 建议使用Tier 2以上账号以获得更高速率限制

### 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 💡 常见问题

### Q: API Key会被上传到服务器吗？
**A:** 不会。API Key仅保存在您的浏览器LocalStorage中，永远不会上传到任何服务器。

### Q: 翻译质量如何？
**A:** 翻译质量取决于所选模型。GPT-4o提供最高质量，GPT-4o-mini在大多数情况下也能提供良好的翻译质量，且成本更低。

### Q: 可以翻译其他格式的电子书吗？
**A:** 目前仅支持EPUB格式。PDF、MOBI等格式需要先转换为EPUB。

### Q: 翻译过程中可以关闭浏览器吗？
**A:** 不建议。翻译过程中关闭浏览器会丢失当前进度。建议等待翻译完成后再关闭。

### Q: 翻译成本如何计算？
**A:** 成本基于OpenAI的Token计费：
- GPT-4o：$5.00 / 1M input tokens, $15.00 / 1M output tokens
- GPT-4o-mini：$0.150 / 1M input tokens, $0.600 / 1M output tokens

### Q: 支持其他AI翻译引擎吗？
**A:** MVP版本仅支持OpenAI。未来版本计划支持：
- Anthropic Claude
- Google Gemini

## 🗺️ 开发路线图

### ✅ v0.1 (当前版本 - MVP)
- [x] EPUB上传与解析
- [x] OpenAI翻译集成
- [x] 基础UI和进度显示
- [x] EPUB生成与下载

### 🔜 v0.2 (计划中)
- [ ] 支持Claude和Gemini
- [ ] API Key加密存储
- [ ] 翻译暂停后断点续传
- [ ] 双语对照EPUB导出

### 🔮 v0.3 (未来)
- [ ] 章节选择性翻译
- [ ] 翻译历史记录
- [ ] 深色模式
- [ ] 翻译质量评分

## 📝 许可证

MIT License

## 🙏 致谢

- [JSZip](https://stuk.github.io/jszip/) - EPUB解析
- [OpenAI](https://openai.com/) - AI翻译引擎

## 👨‍💻 作者

Created with Claude Code

---

**享受阅读！** 📖✨
