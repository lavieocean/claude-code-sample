# 🌐 在线预览与部署指南

本工具支持多种在线访问方式，无需本地安装任何软件。

---

## 🚀 方式1：GitHub Pages（最简单）

### 特点
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 无需服务器

### 部署步骤

#### 1. Fork这个仓库
```
1. 访问仓库页面
2. 点击右上角 "Fork" 按钮
3. 等待Fork完成
```

#### 2. 启用GitHub Pages
```
1. 进入你Fork的仓库
2. 点击 "Settings"（设置）
3. 左侧菜单找到 "Pages"
4. Source 选择: "Deploy from a branch"
5. Branch 选择: "main" 或 "master"
6. Folder 选择: "/epub-translator"
7. 点击 "Save"
```

#### 3. 访问你的网站
```
等待1-2分钟后，访问：
https://你的用户名.github.io/仓库名/

例如：
https://john.github.io/claude-code-sample/
```

### 优势
- 🎉 永久免费托管
- 🔒 自动HTTPS加密
- 🌍 全球访问速度快
- 📱 支持所有设备

---

## 🔥 方式2：Vercel（推荐）

### 特点
- ✅ 部署速度极快（30秒）
- ✅ 自动CI/CD
- ✅ 自定义域名
- ✅ 更快的访问速度

### 部署步骤

#### 1. 准备
- GitHub账号
- Fork本仓库

#### 2. 一键部署
```
1. 访问 https://vercel.com/
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 授权并选择你Fork的仓库
5. 配置项目：
   - Framework Preset: Other
   - Root Directory: epub-translator
   - Build Command: (留空)
   - Output Directory: (留空)
6. 点击 "Deploy"
```

#### 3. 访问你的网站
```
Vercel会自动生成一个URL：
https://your-project.vercel.app

你也可以绑定自己的域名！
```

### 优势
- ⚡ 部署超快
- 🔄 自动同步GitHub更新
- 🌐 多地域CDN
- 💯 99.99% 可用性

---

## 🌟 方式3：Netlify

### 特点
- ✅ 拖拽上传即可
- ✅ 免费SSL证书
- ✅ 表单处理
- ✅ 函数支持

### 部署步骤

#### 方法A：Git部署（推荐）
```
1. 访问 https://netlify.com/
2. 注册/登录
3. 点击 "Add new site" > "Import an existing project"
4. 连接GitHub并选择仓库
5. 配置：
   - Base directory: epub-translator
   - Build command: (留空)
   - Publish directory: (留空)
6. 点击 "Deploy site"
```

#### 方法B：拖拽部署
```
1. 下载epub-translator文件夹
2. 访问 https://app.netlify.com/drop
3. 直接拖拽文件夹到网页
4. 完成！
```

### 优势
- 🎨 友好的控制面板
- 📊 流量统计
- 🔌 丰富的插件
- 🆓 慷慨的免费额度

---

## 💻 方式4：本地服务器

### Python（推荐）
```bash
cd epub-translator
python3 -m http.server 8000

# 访问 http://localhost:8000
```

### Node.js
```bash
npx http-server epub-translator -p 8000

# 访问 http://localhost:8000
```

### PHP
```bash
cd epub-translator
php -S localhost:8000

# 访问 http://localhost:8000
```

---

## 🌍 方式5：直接打开（最简单）

### 本地文件访问
```
1. 下载epub-translator文件夹
2. 找到index.html
3. 双击打开（或右键 > 打开方式 > 浏览器）
4. 开始使用！
```

### 注意事项
⚠️ 某些浏览器（如Chrome）可能限制本地文件的某些功能。推荐使用本地服务器或在线部署。

---

## 📊 各方案对比

| 方案 | 难度 | 速度 | 费用 | HTTPS | 自定义域名 |
|------|-----|------|------|-------|-----------|
| **GitHub Pages** | ⭐ | 🚀🚀 | 免费 | ✅ | ✅ |
| **Vercel** | ⭐⭐ | 🚀🚀🚀 | 免费 | ✅ | ✅ |
| **Netlify** | ⭐⭐ | 🚀🚀🚀 | 免费 | ✅ | ✅ |
| **本地服务器** | ⭐⭐⭐ | 🚀 | 免费 | ❌ | ❌ |
| **直接打开** | ⭐ | 🚀 | 免费 | ❌ | ❌ |

---

## 🎯 推荐方案

### 个人使用
**推荐：直接打开 或 本地服务器**
- 最简单快速
- 无需注册账号
- 数据完全本地

### 分享给他人
**推荐：GitHub Pages 或 Vercel**
- 免费永久托管
- 可以分享链接
- 专业的域名

### 企业使用
**推荐：Vercel 或 自建服务器**
- 自定义域名
- 更高的可用性
- 技术支持

---

## 🔧 高级配置

### 自定义域名（GitHub Pages）

1. 购买域名（如：mytranslator.com）
2. 在域名DNS设置中添加：
   ```
   类型: CNAME
   主机记录: www
   记录值: 你的用户名.github.io
   ```
3. 在GitHub Pages设置中输入自定义域名
4. 等待DNS生效（10分钟-24小时）

### 自定义域名（Vercel）

1. 在Vercel项目设置中点击 "Domains"
2. 输入你的域名
3. 按照提示配置DNS
4. 等待验证完成

---

## ⚠️ 注意事项

### 1. API Key安全
- ✅ 所有方案都将API Key存储在用户本地浏览器
- ✅ 代码中不包含任何硬编码的API Key
- ✅ 完全安全，无泄露风险

### 2. 文件隐私
- ✅ EPUB文件仅在浏览器中处理
- ✅ 不会上传到任何服务器
- ✅ 翻译文本发送到AI API（OpenAI/Gemini）

### 3. 浏览器兼容性
- ✅ Chrome/Edge 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ❌ IE不支持

### 4. 大文件处理
- 建议文件大小 < 10MB
- 对于超大文件，建议使用本地服务器或现代浏览器

---

## 📱 移动端使用

所有部署方案都支持移动端访问：

### iOS
- Safari浏览器
- Chrome浏览器

### Android
- Chrome浏览器
- Firefox浏览器

**注意：** 移动端上传大文件可能较慢，建议使用桌面端。

---

## 🆘 常见问题

### Q: 部署后无法访问？
**A:**
- 检查GitHub Pages是否正确配置
- 等待1-2分钟让更改生效
- 尝试清除浏览器缓存

### Q: 可以修改代码后重新部署吗？
**A:**
- 可以！修改后推送到GitHub
- GitHub Pages / Vercel 会自动重新部署

### Q: 部署需要付费吗？
**A:**
- GitHub Pages: 完全免费
- Vercel: 免费额度充足（个人使用足够）
- Netlify: 免费额度充足

### Q: 可以使用自己的服务器吗？
**A:**
- 当然可以！只需将epub-translator文件夹上传到Web服务器
- 无需数据库，无需后端
- 纯静态文件，任何Web服务器都支持

---

## 📧 技术支持

如果部署遇到问题：

1. 检查浏览器控制台的错误信息
2. 确认文件路径正确
3. 查看本仓库的Issues
4. 提交新的Issue描述问题

---

## 🎉 开始部署

选择适合你的方案，立即开始使用！

**推荐流程：**
1. 🚀 先本地打开测试功能
2. 🌐 满意后部署到GitHub Pages分享
3. ⚡ 需要更快速度时迁移到Vercel

**祝你部署顺利！** 🎊
