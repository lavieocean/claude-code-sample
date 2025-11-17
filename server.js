const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 初始化 Anthropic 客户端
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// 存储已使用的谚语（会话级别）
const sessionUsedProverbs = new Map();

// 生成新题目
app.post('/api/generate-question', async (req, res) => {
    try {
        const { usedProverbs = [] } = req.body;

        const prompt = `请生成一个中国谚语，并将其翻译成表情符号。

要求：
1. 选择一个常见的中国谚语
2. 用表情符号形象地表达这个谚语的含义
3. 表情符号要有创意且能让人联想到谚语的意思
4. 不要使用以下已经用过的谚语：${usedProverbs.join('、')}

请严格按照以下JSON格式返回，不要添加任何其他文字：
{
  "proverb": "完整的谚语",
  "emoji": "表情符号表达"
}

示例：
{
  "proverb": "一石二鸟",
  "emoji": "🪨➕🐦🐦"
}`;

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        // 解析响应
        const responseText = message.content[0].text.trim();
        console.log('Claude API 响应:', responseText);

        // 尝试提取 JSON
        let questionData;
        try {
            // 直接解析
            questionData = JSON.parse(responseText);
        } catch (e) {
            // 如果失败，尝试提取 JSON 代码块
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                            responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                            responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                questionData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } else {
                throw new Error('无法解析 JSON 响应');
            }
        }

        // 验证数据格式
        if (!questionData.proverb || !questionData.emoji) {
            throw new Error('响应格式不正确');
        }

        console.log('生成的题目:', questionData);
        res.json(questionData);

    } catch (error) {
        console.error('生成题目错误:', error);
        res.status(500).json({
            error: '生成题目失败',
            message: error.message
        });
    }
});

// 检查答案
app.post('/api/check-answer', async (req, res) => {
    try {
        const { userAnswer, correctAnswer } = req.body;

        if (!userAnswer || !correctAnswer) {
            return res.status(400).json({
                error: '缺少必要参数'
            });
        }

        // 使用 Claude API 进行智能答案比对
        const prompt = `请判断用户的答案是否与正确答案意思相同或相近。

正确答案：${correctAnswer}
用户答案：${userAnswer}

判断标准：
1. 完全匹配：字面意思完全一致
2. 近似匹配：意思相同但表达略有差异（如"滴水穿石"和"水滴石穿"）
3. 部分匹配：核心意思相同，但有细微差别
4. 不匹配：意思完全不同

请严格按照以下JSON格式返回，不要添加任何其他文字：
{
  "isCorrect": true/false,
  "similarity": 0-100的数字,
  "explanation": "简短解释"
}

如果相似度>=80，则认为是正确的（isCorrect为true）。`;

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 512,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        const responseText = message.content[0].text.trim();
        console.log('答案检查响应:', responseText);

        // 解析响应
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                            responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                            responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } else {
                throw new Error('无法解析 JSON 响应');
            }
        }

        res.json(result);

    } catch (error) {
        console.error('检查答案错误:', error);
        res.status(500).json({
            error: '检查答案失败',
            message: error.message
        });
    }
});

// 获取提示
app.post('/api/get-hint', async (req, res) => {
    try {
        const { proverb } = req.body;

        if (!proverb) {
            return res.status(400).json({
                error: '缺少谚语参数'
            });
        }

        const prompt = `对于谚语"${proverb}"，请提供一个有用但不直接给出答案的提示。

提示要求：
1. 不要直接说出谚语本身
2. 可以提示谚语的主题、寓意或包含的关键字
3. 提示要简短（20字以内）
4. 要有启发性

请只返回提示文字，不要有其他内容。`;

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 256,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        const hint = message.content[0].text.trim();
        console.log('生成的提示:', hint);

        res.json({ hint });

    } catch (error) {
        console.error('获取提示错误:', error);
        res.status(500).json({
            error: '获取提示失败',
            message: error.message
        });
    }
});

// 提供游戏页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'emoji-proverb-game.html'));
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🎮 表情符号谚语游戏服务器运行在 http://localhost:${PORT}`);
    console.log(`📝 请确保设置了 ANTHROPIC_API_KEY 环境变量`);
});

// 错误处理
process.on('unhandledRejection', (error) => {
    console.error('未处理的 Promise 拒绝:', error);
});
