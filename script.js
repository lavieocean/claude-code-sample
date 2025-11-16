// MIDI 电子琴应用
class MIDIKeyboard {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentOctave = 4;
        this.currentTimbre = 'sine';
        this.activeOscillators = new Map();
        this.keyPressed = new Set();

        // 音符到频率的映射 (A4 = 440Hz)
        this.noteFrequencies = {
            'C': 261.63,
            'C#': 277.18,
            'D': 293.66,
            'D#': 311.13,
            'E': 329.63,
            'F': 349.23,
            'F#': 369.99,
            'G': 392.00,
            'G#': 415.30,
            'A': 440.00,
            'A#': 466.16,
            'B': 493.88
        };

        // 键盘按键到音符的映射
        this.keyMap = {
            'A': 'C',
            'W': 'C#',
            'S': 'D',
            'E': 'D#',
            'D': 'E',
            'F': 'F',
            'T': 'F#',
            'G': 'G',
            'Y': 'G#',
            'H': 'A',
            'U': 'A#',
            'J': 'B'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateOctaveDisplay();
    }

    setupEventListeners() {
        // 八度控制
        document.getElementById('octave-up').addEventListener('click', () => this.changeOctave(1));
        document.getElementById('octave-down').addEventListener('click', () => this.changeOctave(-1));

        // 音色选择
        document.getElementById('timbre').addEventListener('change', (e) => {
            this.currentTimbre = e.target.value;
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // 鼠标点击钢琴键
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('mousedown', () => {
                const note = key.dataset.note;
                this.playNote(note);
                key.classList.add('active');
            });

            key.addEventListener('mouseup', () => {
                const note = key.dataset.note;
                this.stopNote(note);
                key.classList.remove('active');
            });

            key.addEventListener('mouseleave', () => {
                const note = key.dataset.note;
                this.stopNote(note);
                key.classList.remove('active');
            });
        });
    }

    changeOctave(direction) {
        this.currentOctave = Math.max(0, Math.min(8, this.currentOctave + direction));
        this.updateOctaveDisplay();
    }

    updateOctaveDisplay() {
        document.getElementById('octave-display').textContent = this.currentOctave;
    }

    handleKeyDown(e) {
        const key = e.key.toUpperCase();

        // 防止重复按键
        if (this.keyPressed.has(key)) {
            return;
        }

        if (this.keyMap[key]) {
            e.preventDefault();
            this.keyPressed.add(key);
            const note = this.keyMap[key];
            this.playNote(note);
            this.highlightKey(key, true);
        }
    }

    handleKeyUp(e) {
        const key = e.key.toUpperCase();

        if (this.keyMap[key]) {
            e.preventDefault();
            this.keyPressed.delete(key);
            const note = this.keyMap[key];
            this.stopNote(note);
            this.highlightKey(key, false);
        }
    }

    highlightKey(key, active) {
        const keyElement = document.querySelector(`[data-key="${key}"]`);
        if (keyElement) {
            if (active) {
                keyElement.classList.add('active');
            } else {
                keyElement.classList.remove('active');
            }
        }
    }

    getFrequency(note) {
        const baseFrequency = this.noteFrequencies[note];
        // 计算当前八度的频率
        const octaveMultiplier = Math.pow(2, this.currentOctave - 4);
        return baseFrequency * octaveMultiplier;
    }

    playNote(note) {
        // 如果该音符已经在播放，先停止
        if (this.activeOscillators.has(note)) {
            this.stopNote(note);
        }

        const frequency = this.getFrequency(note);

        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = this.currentTimbre;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // 设置音量包络 (ADSR)
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Attack
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);  // Decay to Sustain

        // 连接音频节点
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // 开始播放
        oscillator.start(now);

        // 保存振荡器和增益节点的引用
        this.activeOscillators.set(note, { oscillator, gainNode });
    }

    stopNote(note) {
        if (!this.activeOscillators.has(note)) {
            return;
        }

        const { oscillator, gainNode } = this.activeOscillators.get(note);
        const now = this.audioContext.currentTime;

        // 释放音符 (Release)
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);

        // 停止振荡器
        oscillator.stop(now + 0.1);

        // 从活动振荡器中移除
        this.activeOscillators.delete(note);
    }
}

// 初始化应用
let keyboard;

// 等待用户交互后初始化音频上下文（浏览器安全策略要求）
document.addEventListener('DOMContentLoaded', () => {
    keyboard = new MIDIKeyboard();

    // 提示用户点击以启用音频
    const container = document.querySelector('.container');
    const notice = document.createElement('div');
    notice.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #667eea;
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: bold;
    `;
    notice.textContent = '点击任意位置或按键开始演奏！';
    document.body.appendChild(notice);

    const enableAudio = () => {
        if (keyboard.audioContext.state === 'suspended') {
            keyboard.audioContext.resume();
        }
        notice.remove();
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
});
