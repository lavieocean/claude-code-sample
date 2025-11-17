import { useState, useEffect } from 'react'
import './App.css'
import Anthropic from '@anthropic-ai/sdk'

function App() {
  const [dreams, setDreams] = useState([])
  const [dreamTitle, setDreamTitle] = useState('')
  const [dreamContent, setDreamContent] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [expandedDream, setExpandedDream] = useState(null)
  const [interpretingDream, setInterpretingDream] = useState(null)

  // Load dreams and API key from localStorage on mount
  useEffect(() => {
    const savedDreams = localStorage.getItem('dreams')
    const savedApiKey = localStorage.getItem('anthropicApiKey')

    if (savedDreams) {
      try {
        setDreams(JSON.parse(savedDreams))
      } catch (e) {
        console.error('Failed to load dreams:', e)
      }
    }

    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // Save dreams to localStorage whenever they change
  useEffect(() => {
    if (dreams.length > 0) {
      localStorage.setItem('dreams', JSON.stringify(dreams))
    }
  }, [dreams])

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('anthropicApiKey', apiKey)
    }
  }, [apiKey])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!dreamTitle.trim() || !dreamContent.trim()) {
      alert('请填写梦境标题和内容')
      return
    }

    const newDream = {
      id: Date.now(),
      title: dreamTitle.trim(),
      content: dreamContent.trim(),
      date: new Date().toISOString(),
      interpretation: null
    }

    setDreams([newDream, ...dreams])
    setDreamTitle('')
    setDreamContent('')

    // Auto-interpret if API key is available
    if (apiKey) {
      await interpretDream(newDream.id, newDream.content)
    }
  }

  const interpretDream = async (dreamId, content) => {
    if (!apiKey) {
      alert('请先设置 Anthropic API Key')
      return
    }

    setInterpretingDream(dreamId)

    try {
      const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
      })

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `作为一位温柔、富有同理心的解梦专家，请帮我解读这个梦境。请用温暖、平静的语气，提供深入而有洞察力的分析。

梦境内容：
${content}

请从以下几个角度进行解读：
1. 梦境的整体象征意义
2. 可能反映的情绪状态
3. 与现实生活的潜在联系
4. 积极的启示和建议

请用中文回复，语气要温柔、充满关怀。`
        }]
      })

      const interpretation = message.content[0].text

      setDreams(prevDreams =>
        prevDreams.map(dream =>
          dream.id === dreamId
            ? { ...dream, interpretation }
            : dream
        )
      )
    } catch (error) {
      console.error('Failed to interpret dream:', error)
      alert('解梦失败: ' + (error.message || '未知错误'))
    } finally {
      setInterpretingDream(null)
    }
  }

  const deleteDream = (dreamId) => {
    if (window.confirm('确定要删除这个梦境记录吗？')) {
      setDreams(dreams.filter(dream => dream.id !== dreamId))
      if (dreams.length === 1) {
        localStorage.removeItem('dreams')
      }
    }
  }

  const toggleExpand = (dreamId) => {
    setExpandedDream(expandedDream === dreamId ? null : dreamId)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">✨ 梦境解读</h1>
        <p className="app-subtitle">探索你的潜意识，发现内心的声音</p>
      </header>

      <main>
        {/* API Key Input */}
        <div className="card">
          <form className="dream-form">
            <div className="form-group api-key-section">
              <label className="form-label" htmlFor="api-key">
                🔑 Anthropic API Key
              </label>
              <input
                id="api-key"
                type="password"
                className="form-input api-key-input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
              />
              <p className="api-key-hint">
                你的 API Key 将安全地存储在浏览器本地，仅用于解读梦境
              </p>
            </div>
          </form>
        </div>

        {/* Dream Input Form */}
        <div className="card">
          <form className="dream-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="dream-title">
                🌙 梦境标题
              </label>
              <input
                id="dream-title"
                type="text"
                className="form-input"
                value={dreamTitle}
                onChange={(e) => setDreamTitle(e.target.value)}
                placeholder="给你的梦境起个名字..."
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dream-content">
                💭 梦境内容
              </label>
              <textarea
                id="dream-content"
                className="form-textarea"
                value={dreamContent}
                onChange={(e) => setDreamContent(e.target.value)}
                placeholder="记录下你的梦境...尽可能详细地描述你梦中的场景、人物、情绪和感受"
              />
            </div>

            <button type="submit" className="form-button">
              <span className="button-icon">✨</span>
              记录并解读梦境
            </button>
          </form>
        </div>

        {/* Dreams List */}
        {dreams.length > 0 && (
          <div className="card">
            <div className="dreams-container">
              <div className="dreams-header">
                <h2 className="dreams-title">
                  📖 我的梦境日记
                </h2>
                <span className="dreams-count">
                  共 {dreams.length} 个梦境
                </span>
              </div>

              {dreams.map((dream) => (
                <div
                  key={dream.id}
                  className="dream-item"
                >
                  <div className="dream-header">
                    <div>
                      <h3 className="dream-title-text">{dream.title}</h3>
                      <p className="dream-date">{formatDate(dream.date)}</p>
                    </div>
                    <div className="dream-actions">
                      {!dream.interpretation && interpretingDream !== dream.id && (
                        <button
                          className="icon-button"
                          onClick={(e) => {
                            e.stopPropagation()
                            interpretDream(dream.id, dream.content)
                          }}
                          title="解读梦境"
                        >
                          ✨
                        </button>
                      )}
                      <button
                        className="icon-button delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteDream(dream.id)
                        }}
                        title="删除"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div
                    className={`dream-content ${expandedDream === dream.id ? 'expanded' : ''}`}
                    onClick={() => toggleExpand(dream.id)}
                  >
                    {dream.content}
                  </div>

                  {interpretingDream === dream.id && (
                    <div className="dream-interpretation">
                      <div className="interpretation-title">
                        <span className="loading-spinner"></span>
                        正在解读梦境...
                      </div>
                    </div>
                  )}

                  {dream.interpretation && (
                    <div className="dream-interpretation">
                      <div className="interpretation-title">
                        💫 解梦分析
                      </div>
                      <div className="interpretation-content">
                        {dream.interpretation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {dreams.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🌌</div>
              <p className="empty-state-text">
                还没有记录梦境，开始记录你的第一个梦吧
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
