import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Advisor.css'

interface QuestionGroup {
  label: string
  count: number
  examples: string[]
}

type AdvisorTask = 'summary' | 'report' | 'difficulty' | 'quiz' | 'exam'

interface AdvisorAnswer {
  answer: string
  task?: AdvisorTask | null
  item_count?: number | null
  topic: string | null
  matched_count: number
  total_count: number
  period_days: number | null
  groups: QuestionGroup[]
}

const EXAMPLE_QUESTIONS = [
  '컴퓨터구조 관련 학생들 질문은 뭐가 많았어?',
  '컴퓨터구조에서 학생들이 어려워하는 부분 알려줘',
  '학생들 리포트 써줘',
  '컴퓨터구조 퀴즈 5문제 만들어줘',
  '운영체제 시험문제 3개 만들어줘',
]

const TASK_INFO: Record<AdvisorTask, { icon: string; title: string }> = {
  summary: { icon: '📝', title: '질문 빈도 분석' },
  report: { icon: '📋', title: '학생 질문 리포트' },
  difficulty: { icon: '🧩', title: '학생들이 어려워하는 부분' },
  quiz: { icon: '✏️', title: '생성된 퀴즈' },
  exam: { icon: '📄', title: '생성된 시험문제' },
}

const PERIOD_OPTIONS: { label: string; days: number | null }[] = [
  { label: '전체(4개월)', days: null },
  { label: '최근 30일', days: 30 },
  { label: '최근 7일', days: 7 },
]

// 백엔드·AI 서버에 연결할 수 없을 때 화면 구성을 미리 볼 수 있는 예시 응답
const DEMO_ANSWER: AdvisorAnswer = {
  answer:
    '최근 4개월 동안 컴퓨터구조 관련 학생 질문은 14건이었습니다.\n\n' +
    '- 캐시 메모리(5건): 직접 매핑과 세트 연관 매핑의 차이, 주소를 태그·인덱스·오프셋으로 나누는 방법에 대한 질문이 가장 많았습니다.\n' +
    '- 파이프라인 해저드(4건): 포워딩으로 해결되지 않는 load-use 해저드와 stall 발생 시점을 헷갈려 했습니다.\n' +
    '- MIPS 명령어와 데이터패스(3건): lw/sw 형식과 제어 신호 결정 과정에 대한 질문이 있었습니다.\n\n' +
    '캐시 주소 분할 예제와 load-use 해저드 타이밍 다이어그램을 보충 자료로 제공하는 것을 권장합니다.',
  task: 'summary',
  item_count: null,
  topic: '컴퓨터구조',
  matched_count: 14,
  total_count: 27,
  period_days: null,
  groups: [
    {
      label: '캐시 메모리',
      count: 5,
      examples: [
        '2-way 세트 연관 캐시에서 주소를 태그, 인덱스, 오프셋으로 나누는 법 알려줘',
        '캐시 직접 매핑이랑 세트 연관 매핑 차이가 뭐야?',
      ],
    },
    {
      label: '파이프라인 해저드',
      count: 4,
      examples: ['load-use 해저드는 포워딩으로도 왜 해결이 안 돼?', '파이프라인에서 stall이 언제 생기는지 모르겠어'],
    },
    {
      label: 'MIPS 명령어와 데이터패스',
      count: 3,
      examples: ['MIPS 명령어 lw sw 형식이 헷갈려요'],
    },
    { label: '성능 계산', count: 1, examples: ['CPI랑 클럭 속도로 성능 계산하는 문제 어떻게 풀어?'] },
    { label: '가상 메모리(TLB)', count: 1, examples: ['TLB가 가상주소를 물리주소로 바꾸는 과정 알려줘'] },
  ],
}

function periodText(days: number | null) {
  return days ? `최근 ${days}일` : '최근 4개월'
}

function Advisor() {
  const [question, setQuestion] = useState(EXAMPLE_QUESTIONS[0])
  const [days, setDays] = useState<number | null>(null)
  const [result, setResult] = useState<AdvisorAnswer | null>(DEMO_ANSWER)
  const [askedQuestion, setAskedQuestion] = useState(EXAMPLE_QUESTIONS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAsk = async (target: string = question) => {
    const trimmed = target.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    setError(null)
    setAskedQuestion(trimmed)

    try {
      const response = await fetch('/api/v1/advisor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, days }),
      })
      const data: AdvisorAnswer = await response.json()
      if (response.ok) {
        setResult(data)
        setIsDemoMode(false)
      } else {
        // 서버가 안내 문구를 보낸 경우(입력 오류, 분석 실패)
        setError(data.answer || '학생 질문을 분석하지 못했습니다.')
      }
    } catch {
      // 서버에 연결할 수 없으면 예시 응답으로 화면을 보여준다.
      setResult(DEMO_ANSWER)
      setIsDemoMode(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuestion(example)
    handleAsk(example)
  }

  const maxCount = Math.max(1, ...(result?.groups.map((g) => g.count) ?? [1]))
  const taskInfo = TASK_INFO[result?.task ?? 'summary'] ?? TASK_INFO.summary
  const isGeneration = result?.task === 'quiz' || result?.task === 'exam'

  return (
    <div className="advisor-container">
      {/* ─── Header ─── */}
      <header className="advisor-header">
        <div className="advisor-header-left">
          <Link to="/" className="advisor-logo">
            <span className="advisor-logo-icon">🍀</span>
            Four-Leaf
          </Link>
          <span className="advisor-header-divider">/</span>
          <span className="advisor-header-title">AI 어드바이저 (교수자용 대시보드)</span>
        </div>
        <div className="advisor-header-right">
          <span className="advisor-demo-badge">
            {isDemoMode ? '✨ 예시 응답 (서버 미연결)' : '⚡ 실시간 학생 질문 분석'}
          </span>
          <Link to="/chat" className="advisor-nav-btn">
            AI 튜터 채팅 →
          </Link>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="advisor-main">
        <div className="advisor-hero">
          <p className="advisor-eyebrow">Instructor Analytics Dashboard</p>
          <h1 className="advisor-title">
            학생 질문 기록에 <span className="text-gradient">무엇이든 물어보세요</span>.
          </h1>
          <p className="advisor-subtitle">
            AI 튜터에 들어온 학생 질문(최근 4개월 보관)을 Claude가 분석해 답합니다.
            <br />
            많이 나온 질문과 어려워하는 부분을 묻거나, 리포트·퀴즈·시험문제를 요청할 수 있습니다.
          </p>
        </div>

        {/* ─── Question Card ─── */}
        <section className="advisor-search-card">
          <label htmlFor="advisor-question-input" className="advisor-search-label">
            예시 질문:
          </label>
          <div className="advisor-quick-chips">
            {EXAMPLE_QUESTIONS.map((example) => (
              <button
                key={example}
                type="button"
                className={`advisor-chip ${askedQuestion === example ? 'active' : ''}`}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
              >
                💬 {example}
              </button>
            ))}
          </div>

          <div className="advisor-quick-chips" style={{ marginTop: '0.75rem' }}>
            <span className="advisor-chips-label">분석 기간:</span>
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`advisor-chip ${days === option.days ? 'active' : ''}`}
                onClick={() => setDays(option.days)}
                disabled={isLoading}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="advisor-input-group" style={{ marginTop: '0.75rem' }}>
            <input
              id="advisor-question-input"
              type="text"
              className="advisor-input"
              placeholder="예: 자료구조에서 학생들이 많이 물어본 내용은?"
              value={question}
              maxLength={1000}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk()
              }}
            />
            <button
              className="advisor-submit-btn"
              onClick={() => handleAsk()}
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? '분석 중...' : '물어보기 ✨'}
            </button>
          </div>
        </section>

        {/* ─── Loading State ─── */}
        {isLoading && (
          <div className="advisor-loading-card">
            <div className="advisor-spinner" />
            <p className="advisor-loading-text">학생 질문 기록을 분석하고 있습니다...</p>
          </div>
        )}

        {/* ─── Error ─── */}
        {!isLoading && error && (
          <div className="advisor-card advisor-error-card">
            <p className="advisor-card-text">⚠️ {error}</p>
          </div>
        )}

        {/* ─── Results ─── */}
        {!isLoading && !error && result && (
          <div className="advisor-results">
            <div className="advisor-result-header">
              <h2>💬 {askedQuestion}</h2>
              <span className="advisor-timestamp">
                {isDemoMode ? '✨ 예시 응답' : '🟢 실시간 DB 분석'}
              </span>
            </div>

            <div className="advisor-tags advisor-meta">
              <span className="advisor-tag">기간: {periodText(result.period_days)}</span>
              <span className="advisor-tag">
                {taskInfo.icon} {taskInfo.title}
                {result.item_count ? ` · ${result.item_count}문항` : ''}
              </span>
              <span className="advisor-tag">주제: {result.topic ?? '전체'}</span>
              <span className="advisor-tag">
                관련 질문 {result.matched_count}건 / 전체 {result.total_count}건
              </span>
            </div>

            <div className="advisor-grid">
              <div className="advisor-card advisor-card--summary">
                <div className="advisor-card-icon">{taskInfo.icon}</div>
                <h3 className="advisor-card-title">{taskInfo.title}</h3>
                <p className="advisor-card-text">{result.answer}</p>
              </div>

              {result.groups.length > 0 && (
                <div className="advisor-card">
                  <div className="advisor-card-icon">📊</div>
                  <h3 className="advisor-card-title">
                    {isGeneration ? '문항의 근거가 된 학생 질문 유형' : '질문 유형별 건수'}
                  </h3>
                  <ul className="advisor-rec-list">
                    {result.groups.map((group, i) => (
                      <li key={`${group.label}-${i}`} className="advisor-rec-item advisor-group-item">
                        <span className="advisor-rec-num">{i + 1}</span>
                        <div className="advisor-rec-text">
                          <div className="advisor-group-head">
                            <strong>{group.label}</strong>
                            <span className="advisor-group-count">{group.count}건</span>
                          </div>
                          <div className="advisor-group-bar">
                            <div
                              className="advisor-group-bar-fill"
                              style={{ width: `${(group.count / maxCount) * 100}%` }}
                            />
                          </div>
                          {group.examples.length > 0 && (
                            <ul className="advisor-group-examples">
                              {group.examples.map((example, j) => (
                                <li key={j}>“{example}”</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Advisor
