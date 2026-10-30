import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Advisor.css'

interface AdvisorReport {
  summary: string
  keywords: string[]
  recommendations: string[]
}

// AI API 키나 DB 데이터가 없어도 바로 볼 수 있는 과목별 풍부한 사전 분석 데이터
const PRESET_REPORTS: Record<string, AdvisorReport> = {
  컴퓨터구조: {
    summary:
      '학생들은 주로 파이프라인 해저드(데이터/구조적 해저드)의 포워딩 기법과 캐시 메모리의 매핑 방식(직접 매핑, 세트 연관 매핑)에 대해 높은 빈도로 질문했습니다. 특히 중간고사 직전 MIPS 명령어 사이클 구현과 관련된 구체적 코드 질문이 집중되었습니다.',
    keywords: ['파이프라인', '데이터해저드', '캐시메모리', 'MIPS', '분기예측'],
    recommendations: [
      '데이터 해저드 해결 기법(Forwarding, Stall)에 대한 애니메이션 시각화 슬라이드 추가 권장',
      '캐시 직접 매핑 vs 세트 연관 매핑 주소 변환 예제 풀이 세션 15분 배정',
      '과제 2번 MIPS 제어 유닛 설계 시 공통 에러 사례 Q&A 공지 게시',
    ],
  },
  운영체제: {
    summary:
      '가상 메모리 페이징 및 페이지 교체 알고리즘(LRU, FIFO)과 프로세스 동기화(뮤텍스와 세마포어의 차이)에 대한 질문이 가장 많았습니다. 데드락 4가지 발생 조건과 해결 방법에 대한 개념 문의도 다수 확인되었습니다.',
    keywords: ['가상메모리', '페이징', '세마포어', '데드락', '페이지교체'],
    recommendations: [
      '세마포어와 뮤텍스의 실제 코드 레벨 동기화 차이점 예시 코드 제공',
      'LRU 페이지 교체 시뮬레이션 과제 전 카운터/스택 방식 구현 팁 안내',
      '경쟁 상태(Race Condition)를 재현해보는 실습 환경 가이드 보강',
    ],
  },
  자료구조: {
    summary:
      'B-트리와 AVL 트리의 회전 연산(LL, LR, RR, RL), 그리고 해시 충돌 해결 기법(체이닝, 개방 주소법)에 대한 질문이 두드러졌습니다. 재귀 호출 기반 이진 탐색 트리 순회 코드에 대한 디버깅 질문도 확인되었습니다.',
    keywords: ['AVL트리', 'B-트리', '해시충돌', '이진탐색트리', '시간복잡도'],
    recommendations: [
      'AVL 트리 회전 알고리즘의 직관적 다이어그램 및 시각화 도구 공유',
      '해시 테이블 버킷 충돌 시 선형 탐사법의 클러스터링 현상 보충 설명',
      '트리 재귀 순회(전위/중위/후위) 시 콜스택 추적 예제 배포',
    ],
  },
  알고리즘: {
    summary:
      '동적 계획법(DP) 점화식 도출과 배낭 문제(Knapsack), 다익스트라 최단 경로 알고리즘의 우선순위 큐 활용에 대한 질문이 다수 접수되었습니다. 시간 복잡도 점근 표기법 증명에 대한 질의도 있었습니다.',
    keywords: ['동적계획법', 'DP점화식', '다익스트라', '배낭문제', '분할정복'],
    recommendations: [
      'DP 테이블 상태 정의 및 점화식 도출 템플릿 단계별 가이드 배포',
      '다익스트라 알고리즘에서 음수 가중치 불가 이유와 벨만-포드 비교 설명',
      '백준/프로그래머스 추천 기출문제 풀이 해설 링크 안내',
    ],
  },
  데이터베이스: {
    summary:
      '정규화(제1~제3정규형, BCNF)와 트랜잭션 격리 수준(ACID, Read Committed vs Serializable), B+ Tree 인덱스 동작 원리에 대한 질문이 주를 이루었습니다.',
    keywords: ['정규화', 'BCNF', '트랜잭션격리', '인덱스', 'SQL최적화'],
    recommendations: [
      '함수 종속성을 기반으로 한 2NF, 3NF 분해 실전 예제 워크시트 제공',
      '인덱스 풀 스캔 vs 레인지 스캔의 실행 계획 분석 실습 진행',
      '실무 트랜잭션 롤백 및 데드락 방지 팁 정리 자료 배포',
    ],
  },
  인공지능: {
    summary:
      '오차역전파(Backpropagation)의 연쇄 법칙 수학적 유도와 과적합(Overfitting) 방지를 위한 규제 기법(Dropout, L2), 경사하강법 옵티마이저(Adam, SGD) 비교 질문이 많았습니다.',
    keywords: ['오차역전파', '과적합방지', 'Adam옵티마이저', '경사하강법', '활성화함수'],
    recommendations: [
      '연쇄 법칙(Chain Rule) 계산 그래프 도식화를 통한 역전파 흐름 시각화',
      '학습률(Learning Rate) 스케줄러 설정과 옵티마이저별 수렴 속도 비교 데모 제공',
      'PyTorch 텐서 연산 기초 튜토리얼 링크 제공',
    ],
  },
  소프트웨어공학: {
    summary:
      '애자일 스크럼 스프린트 운영 방식과 디자인 패턴(싱글톤, 팩토리, 옵저버), 그리고 CI/CD 파이프라인 구성 및 단위 테스트 커버리지 기준에 대한 질문이 다수 확인되었습니다.',
    keywords: ['디자인패턴', '애자일스크럼', '단위테스트', '리팩토링', 'CI/CD'],
    recommendations: [
      'GoF 디자인 패턴의 실무 적용 Before/After 리팩토링 사례 제시',
      '팀 프로젝트 Git 브랜치 전략(Git-flow) 가이드북 공유',
      'JUnit 기반 단위 테스트 및 모의 객체(Mock) 작성 가이드 보강',
    ],
  },
  일반: {
    summary:
      '수강신청 변경 및 취소 기간, 졸업 이수 학점 규정, 복수전공/부전공 평점 기준 및 교환학생 학점 인정에 대한 질문이 주를 이루었습니다. 기숙사 및 장학금 신청 일정 문의도 높았습니다.',
    keywords: ['수강신청', '졸업요건', '복수전공', '국가장학금', '학사일정'],
    recommendations: [
      '2학기 수강신청 일정 및 장바구니 유의사항 학과 공지 메일 발송',
      '전공 필수 과목 미이수로 인한 졸업 유예 방지를 위한 사전 자가진단표 배포',
      '복수전공 진입 설명회 일정 사전 안내',
    ],
  },
}

const POPULAR_COURSES = Object.keys(PRESET_REPORTS)

function Advisor() {
  const [courseName, setCourseName] = useState('컴퓨터구조')
  // 초기 로딩 시에도 즉시 볼 수 있도록 컴퓨터구조 프리셋을 기본값으로 셋팅
  const [report, setReport] = useState<AdvisorReport | null>(PRESET_REPORTS['컴퓨터구조'])
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)

  const handleFetchReport = async (targetCourse: string = courseName) => {
    const trimmed = targetCourse.trim()
    if (!trimmed) return

    setIsLoading(true)

    try {
      // 1. 실제 백엔드 API 호출 시도
      const response = await fetch('/api/v1/advisor/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_name: trimmed }),
      })

      if (response.ok) {
        const data: AdvisorReport = await response.json()
        if (data.summary && !data.summary.includes('없거나') && !data.summary.includes('실패')) {
          setReport(data)
          setIsDemoMode(false)
          setIsLoading(false)
          return
        }
      }
    } catch {
      // API 연결 실패 시 아래의 프리셋 데이터로 자연스럽게 fallback
    }

    // 2. AI API 키가 없거나 서버가 꺼져 있어도 즉시 편하게 볼 수 있도록 프리셋 활용
    setTimeout(() => {
      const fallbackReport = PRESET_REPORTS[trimmed] || {
        summary: `'${trimmed}' 과목에 대해 학생들이 남긴 질문들을 종합한 결과, 기초 개념 이해와 과제 구현 방식에 대한 질문이 골고루 접수되었습니다.`,
        keywords: [trimmed, '기초개념', '과제구현', '중간고사', '시험범위'],
        recommendations: [
          `'${trimmed}' 핵심 개념에 대한 10분 복습 세션 운영 권장`,
          '학생들이 자주 묻는 질문(FAQ) 정리 자료 공유',
          '과제 안내서에 제출 형식 및 채점 기준 상세화',
        ],
      }
      setReport(fallbackReport)
      setIsDemoMode(true)
      setIsLoading(false)
    }, 250)
  }

  const handleChipClick = (course: string) => {
    setCourseName(course)
    handleFetchReport(course)
  }

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
            {isDemoMode ? '✨ 즉시 체험 모드 (API 키 불필요)' : '⚡ 실시간 AI 연동'}
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
            학생 질문 데이터를 분석한 <span className="text-gradient">강의 인사이트</span>.
          </h1>
          <p className="advisor-subtitle">
            AI 튜터에게 들어온 학생 질문들을 실시간 집계하여 핵심 요약, 빈출 키워드, 강의 개선 제안을 도출합니다.
            <br />
            아래 과목 태그를 클릭하면 즉시 분석 리포트를 확인할 수 있습니다.
          </p>
        </div>

        {/* ─── Course Selector Card ─── */}
        <section className="advisor-search-card">
          <label htmlFor="advisor-course-input" className="advisor-search-label">
            분석 대상 과목 선택:
          </label>
          <div className="advisor-quick-chips">
            {POPULAR_COURSES.map((c) => (
              <button
                key={c}
                type="button"
                className={`advisor-chip ${courseName === c ? 'active' : ''}`}
                onClick={() => handleChipClick(c)}
              >
                📚 {c}
              </button>
            ))}
          </div>

          <div className="advisor-input-group" style={{ marginTop: '0.75rem' }}>
            <input
              id="advisor-course-input"
              type="text"
              className="advisor-input"
              placeholder="다른 과목명 직접 입력 (예: 컴퓨터네트워크, 임베디드시스템)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFetchReport()
              }}
            />
            <button
              className="advisor-submit-btn"
              onClick={() => handleFetchReport()}
              disabled={isLoading || !courseName.trim()}
            >
              {isLoading ? '분석 중...' : '리포트 보기 ✨'}
            </button>
          </div>
        </section>

        {/* ─── Loading State ─── */}
        {isLoading && (
          <div className="advisor-loading-card">
            <div className="advisor-spinner" />
            <p className="advisor-loading-text">
              '{courseName}' 과목의 학생 질문 데이터를 불러와 분석 중입니다...
            </p>
          </div>
        )}

        {/* ─── Report Results ─── */}
        {!isLoading && report && (
          <div className="advisor-results">
            <div className="advisor-result-header">
              <h2>📊 '{courseName}' AI 어드바이저 분석 리포트</h2>
              <span className="advisor-timestamp">
                {isDemoMode ? '✨ 샘플 리포트 (즉시 열람)' : '🟢 실시간 DB 집계'}
              </span>
            </div>

            <div className="advisor-grid">
              {/* Card 1: Summary */}
              <div className="advisor-card advisor-card--summary">
                <div className="advisor-card-icon">📝</div>
                <h3 className="advisor-card-title">학생 질문 종합 요약</h3>
                <p className="advisor-card-text">{report.summary}</p>
              </div>

              {/* Card 2: Keywords */}
              <div className="advisor-card advisor-card--keywords">
                <div className="advisor-card-icon">🏷️</div>
                <h3 className="advisor-card-title">핵심 빈출 키워드</h3>
                <div className="advisor-tags">
                  {report.keywords.map((kw, i) => (
                    <span key={i} className="advisor-tag">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 3: Recommendations */}
              <div className="advisor-card advisor-card--recommendations">
                <div className="advisor-card-icon">💡</div>
                <h3 className="advisor-card-title">교수자를 위한 AI 맞춤 제안</h3>
                <ul className="advisor-rec-list">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="advisor-rec-item">
                      <span className="advisor-rec-num">{i + 1}</span>
                      <div className="advisor-rec-text">{rec}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Advisor
