// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.ceil(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(start);
        }
    }, 16);
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate stat numbers
            if (entry.target.classList.contains('timeline-item')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }

            // Animate progress bars
            if (entry.target.classList.contains('industry-card')) {
                const progressBar = entry.target.querySelector('.progress-fill');
                const progress = progressBar.getAttribute('data-progress');
                progressBar.style.width = progress + '%';
                progressBar.style.setProperty('--progress-width', progress + '%');
            }

            // Generic animation
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

// Observe industry cards
document.querySelectorAll('.industry-card').forEach(card => {
    observer.observe(card);
});

// Industry Data
const industryData = {
    retail: {
        title: '零售业的数字化革命',
        icon: '🛒',
        timeline: [
            { year: '1995', event: 'Amazon创立，在线零售起步', impact: '开创电商模式' },
            { year: '2007', event: 'iPhone发布，移动购物兴起', impact: '随时随地购物' },
            { year: '2011', event: '移动支付普及', impact: '无现金社会' },
            { year: '2016', event: 'Amazon Go无人商店', impact: '新零售体验' },
            { year: '2020', event: '直播电商爆发', impact: '社交+购物融合' }
        ],
        companies: ['Amazon', 'Alibaba', 'Shopify', 'Instacart', 'DoorDash'],
        metrics: {
            '电商渗透率': '24%',
            '移动端占比': '72%',
            '全球GMV': '$5.7T'
        },
        insights: '软件重新定义了零售体验，从库存管理到个性化推荐，从支付到配送，整个价值链都被数字化。'
    },
    media: {
        title: '媒体娱乐的流媒体革命',
        icon: '🎬',
        timeline: [
            { year: '1997', event: 'Netflix创立DVD租赁', impact: '挑战传统租赁店' },
            { year: '2007', event: '流媒体服务推出', impact: '按需观看时代' },
            { year: '2008', event: 'Spotify音乐流媒体', impact: '音乐行业转型' },
            { year: '2013', event: 'Netflix原创内容', impact: '科技公司成为内容制作方' },
            { year: '2020', event: '流媒体订阅超10亿', impact: '传统电视衰落' }
        ],
        companies: ['Netflix', 'Spotify', 'Disney+', 'YouTube', 'TikTok'],
        metrics: {
            '流媒体用户': '12亿+',
            '内容投入': '$230B',
            '传统电视下降': '-35%'
        },
        insights: '内容分发方式的根本性变革，从广播到点播，从购买到订阅，软件重新定义了媒体消费。'
    },
    transport: {
        title: '交通出行的共享经济',
        icon: '🚗',
        timeline: [
            { year: '2009', event: 'Uber创立', impact: '共享出行概念诞生' },
            { year: '2010', event: '移动端叫车普及', impact: '改变出行习惯' },
            { year: '2012', event: '滴滴快的合并', impact: '中国市场爆发' },
            { year: '2018', event: '自动驾驶测试', impact: '未来出行愿景' },
            { year: '2023', event: 'Robotaxi商业化', impact: '无人驾驶时代到来' }
        ],
        companies: ['Uber', 'Lyft', '滴滴', 'Waymo', 'Tesla'],
        metrics: {
            '全球用户': '5亿+',
            '年交易额': '$300B',
            '司机数量': '1500万'
        },
        insights: '共享经济模式彻底改变了交通行业，软件平台连接供需两端，优化资源配置。'
    },
    finance: {
        title: '金融科技革命',
        icon: '💰',
        timeline: [
            { year: '2011', event: 'Stripe创立，支付创新', impact: '开发者友好支付' },
            { year: '2013', event: '移动支付爆发', impact: '无现金社会加速' },
            { year: '2015', event: '数字银行兴起', impact: '挑战传统银行' },
            { year: '2017', event: '区块链和加密货币', impact: '去中心化金融' },
            { year: '2021', event: 'DeFi市场规模$200B', impact: '金融基础设施重构' }
        ],
        companies: ['Stripe', 'Square', 'PayPal', 'Revolut', 'Coinbase'],
        metrics: {
            '移动支付用户': '25亿+',
            '数字银行用户': '2亿+',
            'Fintech投资': '$210B'
        },
        insights: '金融服务的每个环节都在被软件重塑，从支付到借贷，从投资到保险。'
    },
    education: {
        title: '在线教育的崛起',
        icon: '📚',
        timeline: [
            { year: '2012', event: 'Coursera等MOOC平台', impact: '优质教育资源开放' },
            { year: '2013', event: 'Duolingo语言学习', impact: '个性化学习体验' },
            { year: '2017', event: '在线K12教育爆发', impact: '课外辅导数字化' },
            { year: '2020', event: '疫情推动远程教育', impact: '2.7亿学生在线学习' },
            { year: '2023', event: 'AI辅助教学', impact: '1对1智能辅导' }
        ],
        companies: ['Coursera', 'Udemy', 'Duolingo', 'Khan Academy', '好未来'],
        metrics: {
            '在线学习者': '1.8亿+',
            '市场规模': '$350B',
            'AI教育投资': '$20B'
        },
        insights: '教育正从标准化走向个性化，软件使得优质教育资源触达全球每个角落。'
    },
    healthcare: {
        title: '数字医疗的变革',
        icon: '🏥',
        timeline: [
            { year: '2010', event: '电子病历系统普及', impact: '医疗数据数字化' },
            { year: '2015', event: '远程医疗兴起', impact: '打破地理限制' },
            { year: '2018', event: 'AI辅助诊断', impact: '提升诊断准确率' },
            { year: '2020', event: '疫情加速数字化', impact: '在线问诊爆发' },
            { year: '2023', event: '精准医疗和基因编辑', impact: '个性化治疗' }
        ],
        companies: ['Teladoc', 'Oscar Health', '平安好医生', '微医', 'Tempus'],
        metrics: {
            '远程医疗用户': '1.2亿+',
            'AI诊断准确率': '95%+',
            '数字健康投资': '$57B'
        },
        insights: '医疗健康是数字化程度较低但潜力巨大的领域，软件正在提升医疗可及性和效率。'
    },
    agriculture: {
        title: '智慧农业的萌芽',
        icon: '🌾',
        timeline: [
            { year: '2013', event: '精准农业技术', impact: 'GPS和传感器应用' },
            { year: '2016', event: '农业无人机普及', impact: '自动化巡检' },
            { year: '2019', event: 'AI农业决策系统', impact: '智能种植优化' },
            { year: '2021', event: '垂直农场和IoT', impact: '都市农业兴起' },
            { year: '2024', event: '农业机器人商业化', impact: '全自动化农场' }
        ],
        companies: ['John Deere', 'Indigo Ag', '大疆农业', 'Farmers Business Network', 'AeroFarms'],
        metrics: {
            '精准农业渗透': '35%',
            '农业数据市场': '$8B',
            '效率提升': '25%+'
        },
        insights: '农业是最传统的行业之一，但软件、传感器和AI正在改变几千年的耕作方式。'
    },
    manufacturing: {
        title: '工业4.0与智能制造',
        icon: '🏭',
        timeline: [
            { year: '2011', event: '工业4.0概念提出', impact: '制造业数字化战略' },
            { year: '2014', event: '工业物联网普及', impact: '设备互联互通' },
            { year: '2017', event: '数字孪生技术', impact: '虚拟仿真优化' },
            { year: '2020', event: 'AI质检和预测维护', impact: '良品率大幅提升' },
            { year: '2023', event: '柔性制造和黑灯工厂', impact: '全自动化生产' }
        ],
        companies: ['Siemens', 'GE Digital', 'Fanuc', '富士康', 'Tesla'],
        metrics: {
            '工业物联网规模': '$250B',
            '数字化工厂': '15%',
            '效率提升': '30%+'
        },
        insights: '制造业的数字化不仅是自动化，更是全流程的数据驱动优化和柔性生产。'
    }
};

// Industry Card Click Handler
document.querySelectorAll('.industry-card').forEach(card => {
    card.addEventListener('click', function() {
        const industry = this.getAttribute('data-industry');
        const data = industryData[industry];
        showIndustryModal(data);
    });
});

// Show Industry Modal
function showIndustryModal(data) {
    const modal = document.getElementById('industry-modal');
    const modalBody = document.getElementById('modal-body');

    let timelineHTML = data.timeline.map(item => `
        <div class="modal-timeline-item">
            <div class="modal-year">${item.year}</div>
            <div class="modal-event">
                <strong>${item.event}</strong>
                <p>${item.impact}</p>
            </div>
        </div>
    `).join('');

    let companiesHTML = data.companies.map(company =>
        `<span class="company-tag">${company}</span>`
    ).join('');

    let metricsHTML = Object.entries(data.metrics).map(([key, value]) => `
        <div class="metric-item">
            <div class="metric-label">${key}</div>
            <div class="metric-value">${value}</div>
        </div>
    `).join('');

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon">${data.icon}</div>
            <h2>${data.title}</h2>
        </div>

        <div class="modal-section">
            <h3>发展历程</h3>
            <div class="modal-timeline">
                ${timelineHTML}
            </div>
        </div>

        <div class="modal-section">
            <h3>代表企业</h3>
            <div class="companies-container">
                ${companiesHTML}
            </div>
        </div>

        <div class="modal-section">
            <h3>关键指标</h3>
            <div class="metrics-grid">
                ${metricsHTML}
            </div>
        </div>

        <div class="modal-section">
            <h3>洞察</h3>
            <p class="insight-text">${data.insights}</p>
        </div>
    `;

    // Add modal styles dynamically
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            .modal-icon {
                font-size: 5rem;
                margin-bottom: 1rem;
            }
            .modal-header h2 {
                color: var(--primary-color);
                font-size: 2rem;
            }
            .modal-section {
                margin: 2rem 0;
            }
            .modal-section h3 {
                color: var(--accent-color);
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            .modal-timeline {
                position: relative;
                padding-left: 2rem;
            }
            .modal-timeline::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 2px;
                background: var(--primary-color);
            }
            .modal-timeline-item {
                display: flex;
                margin-bottom: 1.5rem;
                gap: 1rem;
            }
            .modal-year {
                color: var(--primary-color);
                font-weight: bold;
                min-width: 60px;
            }
            .modal-event strong {
                color: var(--text-primary);
                display: block;
                margin-bottom: 0.3rem;
            }
            .modal-event p {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            .companies-container {
                display: flex;
                flex-wrap: wrap;
                gap: 0.8rem;
            }
            .company-tag {
                background: rgba(99,102,241,0.2);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                color: var(--text-primary);
                font-size: 0.9rem;
            }
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1.5rem;
            }
            .metric-item {
                text-align: center;
                padding: 1rem;
                background: rgba(99,102,241,0.1);
                border-radius: 10px;
            }
            .metric-label {
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            .metric-value {
                color: var(--primary-color);
                font-size: 1.8rem;
                font-weight: bold;
            }
            .insight-text {
                color: var(--text-secondary);
                line-height: 1.8;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }

    modal.style.display = 'block';
}

// Close Modal
const modal = document.getElementById('industry-modal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Chart.js - Market Cap Growth
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('marketCapChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2000', '2005', '2010', '2015', '2020', '2025'],
                datasets: [
                    {
                        label: '软件/互联网公司',
                        data: [500, 1200, 2500, 5000, 10000, 15000],
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '传统行业公司',
                        data: [5000, 6000, 6500, 7000, 7200, 7500],
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#6366f1',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(203, 213, 225, 0.1)'
                        },
                        ticks: {
                            color: '#cbd5e1',
                            callback: function(value) {
                                return '$' + value + 'B';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(203, 213, 225, 0.1)'
                        },
                        ticks: {
                            color: '#cbd5e1'
                        }
                    }
                }
            }
        });
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('#hero .container');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Add animation classes to elements
document.querySelectorAll('.future-card, .insight-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

console.log('🚀 Software Eating the World - Interactive Experience Loaded');
