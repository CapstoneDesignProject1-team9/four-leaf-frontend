import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Chat.css'

interface SourceDocument {
  content?: string
  source?: string
  category?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: SourceDocument[]
}

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 네잎 🍀 AI 튜터입니다. 학사 규정, 수강신청 등 궁금한 점을 편하게 물어보세요.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    const userMsg: ChatMessage = { role: 'user', content: userText }
    
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    try {
      // Spring Boot Backend Request (/api/v1/chat)
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      })

      if (!response.ok) {
        throw new Error('서버와 연결할 수 없습니다.')
      }

      const data = await response.json()
      
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.answer || data.message || '답변을 가져오지 못했습니다.',
        sources: data.sources || undefined,
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: '죄송합니다. 오류가 발생하여 답변을 생성하지 못했습니다. (서버 연결을 확인해주세요)',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      {/* ─── Header ─── */}
      <header className="chat-header">
        <Link to="/" className="chat-logo">
          <span className="chat-logo-icon">🍀</span>
          Four-Leaf
        </Link>
        <div className="chat-header-title">
          Chat with 네잎
        </div>
        <div className="chat-header-model">
          Llama-3 Bllossom
        </div>
      </header>

      {/* ─── Chat Body ─── */}
      <main className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg chat-msg--${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chat-avatar">🍀</div>
              )}
              <div className="chat-bubble-wrapper">
                <div className="chat-bubble">
                  <div className="chat-content">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="chat-sources">
                      <span className="chat-sources-label">📎 참고 문서:</span>
                      {msg.sources.map((s, j) =>
                        s.source ? (
                          <a
                            key={j}
                            className="chat-source-tag"
                            href={s.source}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {s.category ? `${s.category} ${j + 1}` : `참고 문서 ${j + 1}`}
                          </a>
                        ) : (
                          <span key={j} className="chat-source-tag">
                            {s.category || `참고 문서 ${j + 1}`}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg chat-msg--assistant">
              <div className="chat-avatar">🍀</div>
              <div className="chat-bubble-wrapper">
                <div className="chat-bubble chat-bubble--typing">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ─── Input Area ─── */}
      <footer className="chat-footer">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            placeholder="AI 튜터 네잎에게 질문하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <p className="chat-disclaimer">
          네잎은 RAG 기술을 활용하여 대학 내부 문서를 기반으로 답변을 생성합니다. 중요한 내용은 공식 학사지원팀에 교차 검증을 권장합니다.
        </p>
      </footer>
    </div>
  )
}

export default Chat
