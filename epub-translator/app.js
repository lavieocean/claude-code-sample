/**
 * EPUB Translator - 核心应用逻辑
 * MVP Version 0.1
 */

// ==================== 全局状态管理 ====================
const AppState = {
    epub: null,              // EPUB对象
    epubData: null,          // EPUB原始ZIP数据
    metadata: {},            // 书籍元数据
    chapters: [],            // 章节列表
    currentChapter: 0,       // 当前章节索引
    translations: {},        // 翻译结果 {chapterIndex: {paragraphIndex: translation}}
    config: {
        apiProvider: 'openai',
        openaiApiKey: '',
        openaiModel: 'gpt-4o-mini',
        geminiApiKey: '',
        geminiModel: 'gemini-1.5-flash',
        sourceLang: 'en',
        targetLang: 'zh-CN',
        translationStyle: 'fluent'
    },
    isTranslating: false,
    isPaused: false,
    progress: {
        total: 0,
        completed: 0,
        currentChapter: 0
    }
};

// ==================== DOM元素引用 ====================
const Elements = {
    // 上传相关
    uploadArea: null,
    uploadZone: null,
    fileInput: null,
    selectFileBtn: null,

    // 侧边栏
    bookInfo: null,
    bookTitle: null,
    bookAuthor: null,
    chapterCount: null,
    tableOfContents: null,
    sidebarActions: null,
    translateBtn: null,
    downloadBtn: null,

    // 主内容区
    readingArea: null,
    currentChapterTitle: null,
    readingContent: null,
    viewModeRadios: null,

    // 进度
    progressPanel: null,
    progressStatus: null,
    progressPercent: null,
    progressFill: null,
    progressDetails: null,
    progressCost: null,
    pauseBtn: null,

    // 设置模态框
    settingsModal: null,
    settingsBtn: null,
    closeSettings: null,
    saveSettingsBtn: null,
    cancelSettingsBtn: null,

    // 设置表单
    apiProvider: null,
    openaiConfig: null,
    openaiApiKey: null,
    openaiModel: null,
    testOpenaiBtn: null,
    openaiTestResult: null,
    geminiConfig: null,
    geminiApiKey: null,
    geminiModel: null,
    testGeminiBtn: null,
    geminiTestResult: null,
    sourceLang: null,
    targetLang: null,
    translationStyle: null,

    // 加载提示
    loadingOverlay: null,
    loadingText: null
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeEventListeners();
    loadConfig();
    console.log('📚 EPUB Translator 已初始化');
});

function initializeElements() {
    // 上传
    Elements.uploadArea = document.getElementById('uploadArea');
    Elements.uploadZone = document.getElementById('uploadZone');
    Elements.fileInput = document.getElementById('fileInput');
    Elements.selectFileBtn = document.getElementById('selectFileBtn');

    // 侧边栏
    Elements.bookInfo = document.getElementById('bookInfo');
    Elements.bookTitle = document.getElementById('bookTitle');
    Elements.bookAuthor = document.getElementById('bookAuthor');
    Elements.chapterCount = document.getElementById('chapterCount');
    Elements.tableOfContents = document.getElementById('tableOfContents');
    Elements.sidebarActions = document.getElementById('sidebarActions');
    Elements.translateBtn = document.getElementById('translateBtn');
    Elements.downloadBtn = document.getElementById('downloadBtn');

    // 阅读区
    Elements.readingArea = document.getElementById('readingArea');
    Elements.currentChapterTitle = document.getElementById('currentChapterTitle');
    Elements.readingContent = document.getElementById('readingContent');
    Elements.viewModeRadios = document.querySelectorAll('input[name="viewMode"]');

    // 进度
    Elements.progressPanel = document.getElementById('progressPanel');
    Elements.progressStatus = document.getElementById('progressStatus');
    Elements.progressPercent = document.getElementById('progressPercent');
    Elements.progressFill = document.getElementById('progressFill');
    Elements.progressDetails = document.getElementById('progressDetails');
    Elements.progressCost = document.getElementById('progressCost');
    Elements.pauseBtn = document.getElementById('pauseBtn');

    // 设置
    Elements.settingsModal = document.getElementById('settingsModal');
    Elements.settingsBtn = document.getElementById('settingsBtn');
    Elements.closeSettings = document.getElementById('closeSettings');
    Elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    Elements.cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

    Elements.apiProvider = document.getElementById('apiProvider');

    Elements.openaiConfig = document.getElementById('openaiConfig');
    Elements.openaiApiKey = document.getElementById('openaiApiKey');
    Elements.openaiModel = document.getElementById('openaiModel');
    Elements.testOpenaiBtn = document.getElementById('testOpenaiBtn');
    Elements.openaiTestResult = document.getElementById('openaiTestResult');

    Elements.geminiConfig = document.getElementById('geminiConfig');
    Elements.geminiApiKey = document.getElementById('geminiApiKey');
    Elements.geminiModel = document.getElementById('geminiModel');
    Elements.testGeminiBtn = document.getElementById('testGeminiBtn');
    Elements.geminiTestResult = document.getElementById('geminiTestResult');

    Elements.sourceLang = document.getElementById('sourceLang');
    Elements.targetLang = document.getElementById('targetLang');
    Elements.translationStyle = document.getElementById('translationStyle');

    // 加载
    Elements.loadingOverlay = document.getElementById('loadingOverlay');
    Elements.loadingText = document.getElementById('loadingText');
}

function initializeEventListeners() {
    // 文件上传
    Elements.selectFileBtn.addEventListener('click', () => Elements.fileInput.click());
    Elements.fileInput.addEventListener('change', handleFileSelect);

    // 拖拽上传
    Elements.uploadZone.addEventListener('dragover', handleDragOver);
    Elements.uploadZone.addEventListener('dragleave', handleDragLeave);
    Elements.uploadZone.addEventListener('drop', handleDrop);

    // 翻译控制
    Elements.translateBtn.addEventListener('click', startTranslation);
    Elements.pauseBtn.addEventListener('click', togglePause);
    Elements.downloadBtn.addEventListener('click', downloadTranslatedEpub);

    // 设置
    Elements.settingsBtn.addEventListener('click', openSettings);
    Elements.closeSettings.addEventListener('click', closeSettings);
    Elements.saveSettingsBtn.addEventListener('click', saveSettings);
    Elements.cancelSettingsBtn.addEventListener('click', closeSettings);
    Elements.testOpenaiBtn.addEventListener('click', testOpenaiConnection);
    Elements.testGeminiBtn.addEventListener('click', testGeminiConnection);

    // API Provider切换
    Elements.apiProvider.addEventListener('change', handleProviderChange);

    // 视图模式切换
    Elements.viewModeRadios.forEach(radio => {
        radio.addEventListener('change', handleViewModeChange);
    });

    // 点击模态框背景关闭
    Elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === Elements.settingsModal) {
            closeSettings();
        }
    });
}

// ==================== 配置管理 ====================
function loadConfig() {
    const saved = localStorage.getItem('epubTranslatorConfig');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            AppState.config = { ...AppState.config, ...config };
            updateSettingsForm();
        } catch (e) {
            console.error('加载配置失败:', e);
        }
    }
}

function saveConfig() {
    localStorage.setItem('epubTranslatorConfig', JSON.stringify(AppState.config));
}

function updateSettingsForm() {
    Elements.apiProvider.value = AppState.config.apiProvider;
    Elements.openaiApiKey.value = AppState.config.openaiApiKey;
    Elements.openaiModel.value = AppState.config.openaiModel;
    Elements.geminiApiKey.value = AppState.config.geminiApiKey;
    Elements.geminiModel.value = AppState.config.geminiModel;
    Elements.sourceLang.value = AppState.config.sourceLang;
    Elements.targetLang.value = AppState.config.targetLang;
    Elements.translationStyle.value = AppState.config.translationStyle;

    // 显示/隐藏对应的配置区域
    handleProviderChange();
}

function handleProviderChange() {
    const provider = Elements.apiProvider.value;
    Elements.openaiConfig.style.display = provider === 'openai' ? 'block' : 'none';
    Elements.geminiConfig.style.display = provider === 'gemini' ? 'block' : 'none';
}

function openSettings() {
    updateSettingsForm();
    Elements.settingsModal.classList.add('active');
}

function closeSettings() {
    Elements.settingsModal.classList.remove('active');
}

function saveSettings() {
    AppState.config.apiProvider = Elements.apiProvider.value;
    AppState.config.openaiApiKey = Elements.openaiApiKey.value;
    AppState.config.openaiModel = Elements.openaiModel.value;
    AppState.config.geminiApiKey = Elements.geminiApiKey.value;
    AppState.config.geminiModel = Elements.geminiModel.value;
    AppState.config.sourceLang = Elements.sourceLang.value;
    AppState.config.targetLang = Elements.targetLang.value;
    AppState.config.translationStyle = Elements.translationStyle.value;

    saveConfig();
    closeSettings();
    showToast('✅ 设置已保存');
}

async function testOpenaiConnection() {
    const apiKey = Elements.openaiApiKey.value.trim();
    if (!apiKey) {
        Elements.openaiTestResult.textContent = '❌ 请输入API Key';
        Elements.openaiTestResult.style.color = 'var(--error-color)';
        return;
    }

    Elements.testOpenaiBtn.disabled = true;
    Elements.openaiTestResult.textContent = '⏳ 测试中...';
    Elements.openaiTestResult.style.color = 'var(--text-secondary)';

    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (response.ok) {
            Elements.openaiTestResult.textContent = '✅ 连接成功';
            Elements.openaiTestResult.style.color = 'var(--secondary-color)';
        } else {
            Elements.openaiTestResult.textContent = '❌ API Key无效';
            Elements.openaiTestResult.style.color = 'var(--error-color)';
        }
    } catch (error) {
        Elements.openaiTestResult.textContent = '❌ 连接失败';
        Elements.openaiTestResult.style.color = 'var(--error-color)';
    } finally {
        Elements.testOpenaiBtn.disabled = false;
    }
}

async function testGeminiConnection() {
    const apiKey = Elements.geminiApiKey.value.trim();
    if (!apiKey) {
        Elements.geminiTestResult.textContent = '❌ 请输入API Key';
        Elements.geminiTestResult.style.color = 'var(--error-color)';
        return;
    }

    Elements.testGeminiBtn.disabled = true;
    Elements.geminiTestResult.textContent = '⏳ 测试中...';
    Elements.geminiTestResult.style.color = 'var(--text-secondary)';

    try {
        // 测试Gemini API - 使用简单的模型列表API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (response.ok) {
            Elements.geminiTestResult.textContent = '✅ 连接成功';
            Elements.geminiTestResult.style.color = 'var(--secondary-color)';
        } else {
            Elements.geminiTestResult.textContent = '❌ API Key无效';
            Elements.geminiTestResult.style.color = 'var(--error-color)';
        }
    } catch (error) {
        Elements.geminiTestResult.textContent = '❌ 连接失败';
        Elements.geminiTestResult.style.color = 'var(--error-color)';
    } finally {
        Elements.testGeminiBtn.disabled = false;
    }
}

// ==================== 文件上传处理 ====================
function handleDragOver(e) {
    e.preventDefault();
    Elements.uploadZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    Elements.uploadZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    Elements.uploadZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

async function processFile(file) {
    // 验证文件
    if (!file.name.endsWith('.epub')) {
        alert('❌ 请选择EPUB格式的文件');
        return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        alert('❌ 文件太大，请选择小于50MB的文件');
        return;
    }

    showLoading('正在解析EPUB文件...');

    try {
        await parseEpub(file);
        hideLoading();
        showToast('✅ EPUB文件加载成功');

        // 显示内容
        Elements.uploadArea.style.display = 'none';
        Elements.readingArea.style.display = 'block';
        Elements.bookInfo.style.display = 'block';
        Elements.sidebarActions.style.display = 'flex';

        renderBookInfo();
        renderTableOfContents();
        renderChapter(0);
    } catch (error) {
        hideLoading();
        alert('❌ EPUB解析失败: ' + error.message);
        console.error(error);
    }
}

// ==================== EPUB解析 ====================
async function parseEpub(file) {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    AppState.epubData = zip;

    // 读取container.xml获取content.opf路径
    const containerXml = await zip.file('META-INF/container.xml').async('text');
    const containerDoc = new DOMParser().parseFromString(containerXml, 'text/xml');
    const opfPath = containerDoc.querySelector('rootfile').getAttribute('full-path');

    // 读取content.opf
    const opfContent = await zip.file(opfPath).async('text');
    const opfDoc = new DOMParser().parseFromString(opfContent, 'text/xml');

    // 获取基础路径
    const basePath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);

    // 解析元数据
    AppState.metadata = {
        title: opfDoc.querySelector('title')?.textContent || '未知书名',
        author: opfDoc.querySelector('creator')?.textContent || '未知作者',
        language: opfDoc.querySelector('language')?.textContent || 'en'
    };

    // 解析spine（章节顺序）
    const spine = Array.from(opfDoc.querySelectorAll('spine itemref'));
    const manifest = opfDoc.querySelectorAll('manifest item');

    // 创建manifest映射
    const manifestMap = {};
    manifest.forEach(item => {
        manifestMap[item.getAttribute('id')] = {
            href: item.getAttribute('href'),
            mediaType: item.getAttribute('media-type')
        };
    });

    // 获取章节列表
    AppState.chapters = [];
    for (const item of spine) {
        const idref = item.getAttribute('idref');
        const manifestItem = manifestMap[idref];

        if (manifestItem && manifestItem.mediaType.includes('html')) {
            const chapterPath = basePath + manifestItem.href;
            const chapterContent = await zip.file(chapterPath).async('text');

            AppState.chapters.push({
                id: idref,
                path: chapterPath,
                content: chapterContent,
                title: extractChapterTitle(chapterContent) || `Chapter ${AppState.chapters.length + 1}`
            });
        }
    }

    console.log('📖 EPUB解析完成:', AppState.metadata);
    console.log('📑 章节数量:', AppState.chapters.length);
}

function extractChapterTitle(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const h1 = doc.querySelector('h1, h2, h3, title');
    return h1 ? h1.textContent.trim() : null;
}

// ==================== 渲染功能 ====================
function renderBookInfo() {
    Elements.bookTitle.textContent = AppState.metadata.title;
    Elements.bookAuthor.textContent = AppState.metadata.author;
    Elements.chapterCount.textContent = AppState.chapters.length;
}

function renderTableOfContents() {
    Elements.tableOfContents.innerHTML = '';

    AppState.chapters.forEach((chapter, index) => {
        const item = document.createElement('div');
        item.className = 'toc-item';
        item.textContent = chapter.title;
        item.dataset.index = index;

        if (index === AppState.currentChapter) {
            item.classList.add('active');
        }

        item.addEventListener('click', () => {
            renderChapter(index);
        });

        Elements.tableOfContents.appendChild(item);
    });
}

function renderChapter(index) {
    AppState.currentChapter = index;
    const chapter = AppState.chapters[index];

    // 更新标题
    Elements.currentChapterTitle.textContent = chapter.title;

    // 更新目录高亮
    document.querySelectorAll('.toc-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    // 渲染内容
    const viewMode = document.querySelector('input[name="viewMode"]:checked').value;
    renderContent(chapter, viewMode);
}

function renderContent(chapter, viewMode) {
    const doc = new DOMParser().parseFromString(chapter.content, 'text/html');
    const body = doc.body;

    // 提取所有段落
    const paragraphs = Array.from(body.querySelectorAll('p, h1, h2, h3, h4, h5, h6'));

    Elements.readingContent.innerHTML = '';

    if (viewMode === 'original') {
        // 仅显示原文
        paragraphs.forEach(p => {
            const clone = p.cloneNode(true);
            Elements.readingContent.appendChild(clone);
        });
    } else if (viewMode === 'translation') {
        // 仅显示译文
        const chapterTranslations = AppState.translations[AppState.currentChapter] || {};
        paragraphs.forEach((p, i) => {
            const translation = chapterTranslations[i];
            const elem = document.createElement(p.tagName.toLowerCase());
            elem.textContent = translation || p.textContent;
            if (!translation) {
                elem.classList.add('paragraph-translating');
            }
            Elements.readingContent.appendChild(elem);
        });
    } else {
        // 对照模式
        const chapterTranslations = AppState.translations[AppState.currentChapter] || {};
        paragraphs.forEach((p, i) => {
            const pair = document.createElement('div');
            pair.className = 'paragraph-pair';

            const original = document.createElement('div');
            original.className = 'paragraph-original';
            original.textContent = p.textContent;

            const translation = document.createElement('div');
            const translatedText = chapterTranslations[i];
            if (translatedText) {
                translation.className = 'paragraph-translation';
                translation.textContent = translatedText;
            } else {
                translation.className = 'paragraph-translating';
                translation.textContent = '等待翻译...';
            }

            pair.appendChild(original);
            pair.appendChild(translation);
            Elements.readingContent.appendChild(pair);
        });
    }
}

function handleViewModeChange() {
    const chapter = AppState.chapters[AppState.currentChapter];
    const viewMode = document.querySelector('input[name="viewMode"]:checked').value;
    renderContent(chapter, viewMode);
}

// ==================== 翻译功能 ====================
async function startTranslation() {
    // 验证API配置
    const provider = AppState.config.apiProvider;
    if (provider === 'openai' && !AppState.config.openaiApiKey) {
        alert('❌ 请先在设置中配置OpenAI API Key');
        openSettings();
        return;
    }
    if (provider === 'gemini' && !AppState.config.geminiApiKey) {
        alert('❌ 请先在设置中配置Gemini API Key');
        openSettings();
        return;
    }

    AppState.isTranslating = true;
    AppState.isPaused = false;
    Elements.translateBtn.disabled = true;
    Elements.progressPanel.style.display = 'block';

    // 计算总段落数
    let totalParagraphs = 0;
    AppState.chapters.forEach(chapter => {
        const doc = new DOMParser().parseFromString(chapter.content, 'text/html');
        const paragraphs = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        totalParagraphs += paragraphs.length;
    });

    AppState.progress.total = totalParagraphs;
    AppState.progress.completed = 0;

    updateProgress();

    // 开始翻译
    for (let chapterIndex = 0; chapterIndex < AppState.chapters.length; chapterIndex++) {
        if (!AppState.isTranslating) break;

        AppState.progress.currentChapter = chapterIndex;
        await translateChapter(chapterIndex);
    }

    AppState.isTranslating = false;
    Elements.translateBtn.disabled = false;
    Elements.downloadBtn.style.display = 'block';
    showToast('🎉 翻译完成！');
}

async function translateChapter(chapterIndex) {
    const chapter = AppState.chapters[chapterIndex];
    const doc = new DOMParser().parseFromString(chapter.content, 'text/html');
    const paragraphs = Array.from(doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6'));

    if (!AppState.translations[chapterIndex]) {
        AppState.translations[chapterIndex] = {};
    }

    for (let i = 0; i < paragraphs.length; i++) {
        // 检查暂停
        while (AppState.isPaused && AppState.isTranslating) {
            await sleep(100);
        }

        if (!AppState.isTranslating) break;

        const text = paragraphs[i].textContent.trim();
        if (text.length === 0) {
            AppState.translations[chapterIndex][i] = '';
            continue;
        }

        try {
            const translation = await translateText(text);
            AppState.translations[chapterIndex][i] = translation;
            AppState.progress.completed++;

            updateProgress();

            // 如果是当前章节，实时更新显示
            if (chapterIndex === AppState.currentChapter) {
                renderChapter(AppState.currentChapter);
            }

            // 速率限制：每段之间延迟200ms
            await sleep(200);
        } catch (error) {
            console.error('翻译失败:', error);
            AppState.translations[chapterIndex][i] = `[翻译失败: ${error.message}]`;
        }
    }

    // 标记章节为已翻译
    const tocItem = document.querySelector(`.toc-item[data-index="${chapterIndex}"]`);
    if (tocItem) {
        tocItem.classList.add('translated');
    }
}

async function translateText(text) {
    const provider = AppState.config.apiProvider;

    if (provider === 'openai') {
        return await translateWithOpenAI(text);
    } else if (provider === 'gemini') {
        return await translateWithGemini(text);
    } else {
        throw new Error(`不支持的翻译引擎: ${provider}`);
    }
}

async function translateWithOpenAI(text) {
    const apiKey = AppState.config.openaiApiKey;
    const model = AppState.config.openaiModel;

    const styleInstructions = {
        'faithful': '忠实于原文，准确传达原意',
        'fluent': '流畅易读，符合中文表达习惯',
        'literary': '保持文学性，注重语言的美感和韵味'
    };

    const prompt = `你是专业的文学翻译专家。请将以下${AppState.config.sourceLang}文本翻译成${AppState.config.targetLang}。

翻译要求：
1. ${styleInstructions[AppState.config.translationStyle]}
2. 保持原文的语气和风格
3. 不要添加任何额外的解释或注释
4. 只返回翻译结果

原文：
${text}

翻译：`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '翻译请求失败');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

async function translateWithGemini(text) {
    const apiKey = AppState.config.geminiApiKey;
    const model = AppState.config.geminiModel;

    const styleInstructions = {
        'faithful': '忠实于原文，准确传达原意',
        'fluent': '流畅易读，符合中文表达习惯',
        'literary': '保持文学性，注重语言的美感和韵味'
    };

    const prompt = `你是专业的文学翻译专家。请将以下${AppState.config.sourceLang}文本翻译成${AppState.config.targetLang}。

翻译要求：
1. ${styleInstructions[AppState.config.translationStyle]}
2. 保持原文的语气和风格
3. 不要添加任何额外的解释或注释
4. 只返回翻译结果

原文：
${text}

翻译：`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1000
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API错误: ${error}`);
    }

    const data = await response.json();

    // Gemini响应结构
    if (data.candidates && data.candidates.length > 0) {
        const content = data.candidates[0].content;
        if (content && content.parts && content.parts.length > 0) {
            return content.parts[0].text.trim();
        }
    }

    throw new Error('Gemini API返回了意外的响应格式');
}

function togglePause() {
    AppState.isPaused = !AppState.isPaused;
    Elements.pauseBtn.textContent = AppState.isPaused ? '继续' : '暂停';
    updateProgress();
}

function updateProgress() {
    const percent = AppState.progress.total > 0
        ? Math.round((AppState.progress.completed / AppState.progress.total) * 100)
        : 0;

    Elements.progressPercent.textContent = `${percent}%`;
    Elements.progressFill.style.width = `${percent}%`;

    const status = AppState.isPaused
        ? '⏸️ 已暂停'
        : AppState.isTranslating
        ? `正在翻译第 ${AppState.progress.currentChapter + 1} 章 / 共 ${AppState.chapters.length} 章`
        : '✅ 翻译完成';

    Elements.progressStatus.textContent = status;
    Elements.progressDetails.textContent =
        `已翻译：${AppState.progress.completed} / ${AppState.progress.total} 段`;

    // 估算成本（粗略估计）
    const avgTokensPerParagraph = 150;
    const totalTokens = AppState.progress.completed * avgTokensPerParagraph;
    const costPer1kTokens = AppState.config.openaiModel === 'gpt-4o' ? 0.005 : 0.00015;
    const estimatedCost = (totalTokens / 1000) * costPer1kTokens;

    Elements.progressCost.textContent = `已使用成本：~$${estimatedCost.toFixed(4)}`;
}

// ==================== EPUB生成与下载 ====================
async function downloadTranslatedEpub() {
    showLoading('正在生成翻译版EPUB...');

    try {
        // 克隆原始ZIP
        const newZip = new JSZip();

        // 复制所有原始文件
        const files = [];
        AppState.epubData.forEach((relativePath, file) => {
            files.push({ path: relativePath, file: file });
        });

        for (const { path, file } of files) {
            if (!file.dir) {
                const content = await file.async('arraybuffer');
                newZip.file(path, content);
            }
        }

        // 替换章节内容为翻译版本
        for (let i = 0; i < AppState.chapters.length; i++) {
            const chapter = AppState.chapters[i];
            const translations = AppState.translations[i] || {};

            const doc = new DOMParser().parseFromString(chapter.content, 'text/html');
            const paragraphs = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6');

            paragraphs.forEach((p, index) => {
                if (translations[index]) {
                    p.textContent = translations[index];
                }
            });

            const translatedHtml = new XMLSerializer().serializeToString(doc);
            newZip.file(chapter.path, translatedHtml);
        }

        // 生成EPUB文件
        const blob = await newZip.generateAsync({ type: 'blob' });

        // 下载
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${AppState.metadata.title}（中文版）.epub`;
        link.click();

        hideLoading();
        showToast('✅ 下载成功！');
    } catch (error) {
        hideLoading();
        alert('❌ 生成EPUB失败: ' + error.message);
        console.error(error);
    }
}

// ==================== 工具函数 ====================
function showLoading(text = '加载中...') {
    Elements.loadingText.textContent = text;
    Elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    Elements.loadingOverlay.style.display = 'none';
}

function showToast(message) {
    // 简单的Toast提示（未来可以改进）
    console.log(message);
    // 可以添加更好的Toast UI组件
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
