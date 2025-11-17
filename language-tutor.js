// 语言学习导师 - 核心逻辑
class LanguageTutor {
    constructor() {
        // 状态管理
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.currentLanguage = 'es';
        this.chatMode = 'casual';
        this.proficiencyLevel = 'beginner';
        this.conversationHistory = [];
        this.learningGoals = this.loadGoals();
        this.statistics = this.loadStatistics();
        this.sessionStartTime = Date.now();
        this.userVocabulary = new Set();

        // 语言配置
        this.languages = {
            'es': { name: '西班牙语', nativeName: 'Español' },
            'fr': { name: '法语', nativeName: 'Français' },
            'de': { name: '德语', nativeName: 'Deutsch' },
            'ja': { name: '日语', nativeName: '日本語' },
            'it': { name: '意大利语', nativeName: 'Italiano' },
            'pt': { name: '葡萄牙语', nativeName: 'Português' },
            'ru': { name: '俄语', nativeName: 'Русский' },
            'ko': { name: '韩语', nativeName: '한국어' }
        };

        // 熟练程度级别
        this.proficiencyLevels = {
            'beginner': { name: '初学者', progress: 15 },
            'elementary': { name: '基础', progress: 30 },
            'intermediate': { name: '中级', progress: 50 },
            'advanced': { name: '高级', progress: 75 },
            'fluent': { name: '流利', progress: 95 }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkApiKey();
        this.updateProficiencyDisplay();
        this.renderGoals();
        this.updateStatistics();
        this.setupProgressChart();
        this.loadSessionLog();
        this.startSessionTimer();
    }

    setupEventListeners() {
        // 语言选择
        document.getElementById('target-language').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.addBotMessage(`太好了！让我们开始学习${this.languages[this.currentLanguage].name}吧！`);
        });

        // 聊天模式切换
        document.getElementById('chat-mode').addEventListener('change', (e) => {
            this.chatMode = e.target.value;
            const mode = e.target.value === 'casual' ? '休闲聊天' : '结构化课程';
            this.addBotMessage(`已切换到${mode}模式`);
        });

        // 发送消息
        document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // API Key 保存
        document.getElementById('save-api-key').addEventListener('click', () => this.saveApiKey());

        // 添加学习目标
        document.getElementById('add-goal-btn').addEventListener('click', () => this.addGoal());
        document.getElementById('new-goal-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addGoal();
            }
        });

        // 清除日志
        document.getElementById('clear-log-btn').addEventListener('click', () => this.clearLog());
    }

    checkApiKey() {
        const notice = document.getElementById('api-key-notice');
        if (this.apiKey) {
            notice.classList.add('hidden');
        } else {
            notice.classList.remove('hidden');
        }
    }

    saveApiKey() {
        const input = document.getElementById('api-key-input');
        const key = input.value.trim();
        if (key) {
            this.apiKey = key;
            localStorage.setItem('gemini_api_key', key);
            this.checkApiKey();
            this.addBotMessage('API Key 已保存！现在可以开始对话了。');
            input.value = '';
        }
    }

    async sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();

        if (!message) return;
        if (!this.apiKey) {
            alert('请先设置 Gemini API Key');
            return;
        }

        // 显示用户消息
        this.addUserMessage(message);
        input.value = '';

        // 更新统计
        this.statistics.messageCount++;
        this.updateStatistics();

        // 分析用户消息
        this.analyzeUserMessage(message);

        // 发送到 Gemini API
        const sendBtn = document.getElementById('send-btn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading"></span>';

        try {
            const response = await this.callGeminiAPI(message);
            this.addBotMessage(response);

            // 更新熟练程度
            this.updateProficiency();

            // 生成反馈
            await this.generateFeedback(message, response);

            // 更新学习目标
            this.updateLearningGoals();

        } catch (error) {
            console.error('API Error:', error);
            this.addBotMessage('抱歉，发生了错误。请检查你的 API Key 是否正确。');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span>发送</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
        }
    }

    async callGeminiAPI(userMessage) {
        // 构建系统提示
        const systemPrompt = this.buildSystemPrompt();

        // 构建对话历史
        const conversationContext = this.conversationHistory
            .slice(-6) // 只保留最近6条消息
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        const fullPrompt = `${systemPrompt}\n\n对话历史:\n${conversationContext}\n\n用户: ${userMessage}\n\n导师:`;

        // 调用 Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        // 保存到对话历史
        this.conversationHistory.push(
            { role: '用户', content: userMessage },
            { role: '导师', content: botResponse }
        );

        return botResponse;
    }

    buildSystemPrompt() {
        const lang = this.languages[this.currentLanguage];
        const mode = this.chatMode === 'casual' ? '休闲对话' : '结构化教学';

        return `你是一位专业的${lang.name}(${lang.nativeName})语言学习导师。
当前模式: ${mode}
学生水平: ${this.proficiencyLevels[this.proficiencyLevel].name}

你的任务:
1. 用${lang.name}与学生进行对话，同时在必要时提供中文解释
2. 根据学生水平调整语言难度
3. ${this.chatMode === 'casual' ? '进行自然、友好的对话' : '提供结构化的教学内容，包括例句和练习'}
4. 在对话中自然地纠正错误，但不要过于严格
5. 鼓励学生使用新学到的词汇和语法

请用简洁、友好的方式回复，长度控制在2-3句话以内。`;
    }

    analyzeUserMessage(message) {
        // 提取词汇
        const words = message.match(/\b\w+\b/g) || [];
        words.forEach(word => {
            if (word.length > 3) { // 只统计长度大于3的单词
                this.userVocabulary.add(word.toLowerCase());
            }
        });

        this.statistics.vocabularyCount = this.userVocabulary.size;
        this.updateStatistics();
    }

    async generateFeedback(userMessage, botResponse) {
        const feedbackContent = document.getElementById('feedback-content');

        // 清空占位符
        const placeholder = feedbackContent.querySelector('.placeholder-text');
        if (placeholder) {
            placeholder.remove();
        }

        // 生成简单反馈
        const feedbacks = [];

        // 消息长度反馈
        if (userMessage.length > 50) {
            feedbacks.push({
                type: 'positive',
                title: '很好的表达！',
                text: '你使用了较长的句子，这显示出你的表达能力正在提高！'
            });
        }

        // 随机正面反馈
        if (Math.random() > 0.5) {
            const positiveFeedbacks = [
                { title: '保持练习！', text: '持续的对话练习是提高语言能力的最好方式。' },
                { title: '词汇使用', text: '尝试在下次对话中使用刚学到的新词汇。' },
                { title: '语法进步', text: '你的句子结构越来越自然了！' }
            ];
            const randomFeedback = positiveFeedbacks[Math.floor(Math.random() * positiveFeedbacks.length)];
            feedbacks.push({
                type: 'positive',
                ...randomFeedback
            });
        }

        // 添加反馈到界面
        feedbacks.forEach(feedback => {
            this.addFeedback(feedback.type, feedback.title, feedback.text);
        });

        // 保持反馈数量合理（最多显示5条）
        const feedbackItems = feedbackContent.querySelectorAll('.feedback-item');
        if (feedbackItems.length > 5) {
            feedbackItems[0].remove();
        }
    }

    addFeedback(type, title, text) {
        const feedbackContent = document.getElementById('feedback-content');
        const feedbackItem = document.createElement('div');
        feedbackItem.className = `feedback-item ${type}`;
        feedbackItem.innerHTML = `
            <strong>${title}</strong>
            <p>${text}</p>
        `;
        feedbackContent.appendChild(feedbackItem);
        feedbackContent.scrollTop = feedbackContent.scrollHeight;
    }

    updateProficiency() {
        // 根据消息数量和词汇量自动更新熟练程度
        const messages = this.statistics.messageCount;
        const vocab = this.statistics.vocabularyCount;

        if (messages > 50 && vocab > 100) {
            this.proficiencyLevel = 'fluent';
        } else if (messages > 30 && vocab > 60) {
            this.proficiencyLevel = 'advanced';
        } else if (messages > 15 && vocab > 30) {
            this.proficiencyLevel = 'intermediate';
        } else if (messages > 5 && vocab > 10) {
            this.proficiencyLevel = 'elementary';
        }

        this.updateProficiencyDisplay();
    }

    updateProficiencyDisplay() {
        const level = this.proficiencyLevels[this.proficiencyLevel];
        document.getElementById('proficiency-level').textContent = level.name;
        document.getElementById('proficiency-progress').style.width = `${level.progress}%`;
    }

    updateLearningGoals() {
        // 自动生成学习目标
        const vocab = this.statistics.vocabularyCount;
        const messages = this.statistics.messageCount;

        const autoGoals = [];

        if (messages < 10) {
            autoGoals.push('完成10次对话练习');
        }

        if (vocab < 30) {
            autoGoals.push('学习30个新词汇');
        }

        if (messages >= 10 && !this.learningGoals.some(g => g.text.includes('语法'))) {
            autoGoals.push('掌握基本语法结构');
        }

        // 添加新目标（如果不存在）
        autoGoals.forEach(goalText => {
            if (!this.learningGoals.some(g => g.text === goalText)) {
                this.learningGoals.push({
                    id: Date.now() + Math.random(),
                    text: goalText,
                    completed: false
                });
            }
        });

        this.saveGoals();
        this.renderGoals();
    }

    addGoal() {
        const input = document.getElementById('new-goal-input');
        const text = input.value.trim();

        if (text) {
            this.learningGoals.push({
                id: Date.now(),
                text: text,
                completed: false
            });

            this.saveGoals();
            this.renderGoals();
            input.value = '';
        }
    }

    renderGoals() {
        const goalsList = document.getElementById('goals-list');
        goalsList.innerHTML = '';

        this.learningGoals.forEach(goal => {
            const goalItem = document.createElement('div');
            goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
            goalItem.innerHTML = `
                <input type="checkbox" ${goal.completed ? 'checked' : ''}
                    onchange="tutor.toggleGoal(${goal.id})">
                <span>${goal.text}</span>
            `;
            goalsList.appendChild(goalItem);
        });

        // 检查目标完成情况
        this.checkGoalCompletion();
    }

    toggleGoal(goalId) {
        const goal = this.learningGoals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = !goal.completed;
            this.saveGoals();
            this.renderGoals();
        }
    }

    checkGoalCompletion() {
        const messages = this.statistics.messageCount;
        const vocab = this.statistics.vocabularyCount;

        this.learningGoals.forEach(goal => {
            if (goal.text.includes('10次对话') && messages >= 10) {
                goal.completed = true;
            }
            if (goal.text.includes('30个新词汇') && vocab >= 30) {
                goal.completed = true;
            }
        });

        this.saveGoals();
    }

    saveGoals() {
        localStorage.setItem('learning_goals', JSON.stringify(this.learningGoals));
    }

    loadGoals() {
        const saved = localStorage.getItem('learning_goals');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: '识别熟练程度', completed: false }
        ];
    }

    updateStatistics() {
        document.getElementById('vocab-count').textContent = this.statistics.vocabularyCount;
        document.getElementById('message-count').textContent = this.statistics.messageCount;

        // 更新对话时长
        const minutes = Math.floor((Date.now() - this.sessionStartTime) / 60000);
        document.getElementById('conversation-time').textContent = `${minutes}分钟`;

        this.saveStatistics();
        this.updateProgressChart();
    }

    saveStatistics() {
        localStorage.setItem('learning_statistics', JSON.stringify(this.statistics));
    }

    loadStatistics() {
        const saved = localStorage.getItem('learning_statistics');
        return saved ? JSON.parse(saved) : {
            vocabularyCount: 0,
            messageCount: 0,
            sessionHistory: []
        };
    }

    setupProgressChart() {
        const canvas = document.getElementById('progress-chart');
        const ctx = canvas.getContext('2d');

        // 简单的进度图表
        this.chartContext = ctx;
        this.updateProgressChart();
    }

    updateProgressChart() {
        if (!this.chartContext) return;

        const ctx = this.chartContext;
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        // 绘制数据
        const vocab = this.statistics.vocabularyCount;
        const messages = this.statistics.messageCount;

        const barWidth = 60;
        const spacing = 40;
        const maxHeight = height - 40;

        // 词汇量柱状图
        const vocabHeight = Math.min((vocab / 100) * maxHeight, maxHeight);
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(spacing, height - vocabHeight - 20, barWidth, vocabHeight);
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('词汇', spacing + barWidth / 2, height - 5);
        ctx.fillText(vocab.toString(), spacing + barWidth / 2, height - vocabHeight - 25);

        // 消息数柱状图
        const msgHeight = Math.min((messages / 50) * maxHeight, maxHeight);
        ctx.fillStyle = '#50c878';
        ctx.fillRect(spacing * 2 + barWidth, height - msgHeight - 20, barWidth, msgHeight);
        ctx.fillStyle = '#2c3e50';
        ctx.fillText('对话', spacing * 2 + barWidth + barWidth / 2, height - 5);
        ctx.fillText(messages.toString(), spacing * 2 + barWidth + barWidth / 2, height - msgHeight - 25);
    }

    startSessionTimer() {
        // 每分钟更新一次时长
        setInterval(() => {
            this.updateStatistics();
        }, 60000);
    }

    loadSessionLog() {
        const logs = localStorage.getItem('session_logs');
        if (logs) {
            const sessionLog = document.getElementById('session-log');
            const placeholder = sessionLog.querySelector('.placeholder-text');
            if (placeholder) {
                placeholder.remove();
            }

            const logEntries = JSON.parse(logs);
            logEntries.slice(-5).forEach(entry => {
                this.addLogEntry(entry.date, entry.content);
            });
        }
    }

    addLogEntry(date, content) {
        const sessionLog = document.getElementById('session-log');
        const placeholder = sessionLog.querySelector('.placeholder-text');
        if (placeholder) {
            placeholder.remove();
        }

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <div class="log-entry-header">
                <span>${date}</span>
            </div>
            <div class="log-entry-content">${content}</div>
        `;
        sessionLog.appendChild(logEntry);
    }

    saveSessionLog() {
        const lang = this.languages[this.currentLanguage].name;
        const date = new Date().toLocaleDateString('zh-CN');
        const content = `学习${lang}，完成${this.statistics.messageCount}次对话，学习${this.statistics.vocabularyCount}个词汇`;

        const logs = localStorage.getItem('session_logs');
        const logEntries = logs ? JSON.parse(logs) : [];

        logEntries.push({
            date: date,
            content: content
        });

        // 只保留最近20条记录
        if (logEntries.length > 20) {
            logEntries.shift();
        }

        localStorage.setItem('session_logs', JSON.stringify(logEntries));
        this.addLogEntry(date, content);
    }

    clearLog() {
        if (confirm('确定要清除所有学习日志吗？')) {
            localStorage.removeItem('session_logs');
            const sessionLog = document.getElementById('session-log');
            sessionLog.innerHTML = '<p class="placeholder-text">你的学习会话记录将显示在这里...</p>';
        }
    }

    addUserMessage(text) {
        this.addMessage('user', text);
    }

    addBotMessage(text) {
        this.addMessage('bot', text);
    }

    addMessage(type, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const label = type === 'user' ? '你' : '导师';
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>${label}:</strong> ${text}
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// 初始化应用
let tutor;
document.addEventListener('DOMContentLoaded', () => {
    tutor = new LanguageTutor();

    // 页面关闭时保存会话日志
    window.addEventListener('beforeunload', () => {
        if (tutor.statistics.messageCount > 0) {
            tutor.saveSessionLog();
        }
    });
});
