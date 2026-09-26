import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <>
      {/* ─── Navigation ─── */}
      <nav className="nav" id="nav">
        <div className="nav__inner">
          <div className="nav__logo">
            <span className="nav__logo-icon">🍀</span>
            Four-Leaf
          </div>
          <ul className="nav__links">
            <li><a href="#features">기능</a></li>
            <li><a href="#pipeline">파이프라인</a></li>
            <li><a href="#architecture">아키텍처</a></li>
            <li><a href="#get-started">시작하기</a></li>
            <li><Link to="/chat" className="nav__chat-link">Chat with 네잎 ✨</Link></li>
          </ul>
          <a
            className="nav__cta"
            href="https://github.com/CapstoneDesignProject1-team9"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero" id="hero">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          오픈소스 · AWS 기반
        </div>

        <h1 className="hero__title">
          대학 교육에{' '}
          <span className="text-gradient">AI 튜터</span>를<br />
          심다.
        </h1>

        <p className="hero__subtitle">
          오픈소스 LLM 파인튜닝과 RAG 기술로 만든<br />
          24시간 맞춤형 학습·교수 지원 플랫폼
        </p>

        <div className="hero__actions">
          <a href="#get-started" className="btn btn--primary">
            시작하기 →
          </a>
          <Link to="/chat" className="btn btn--chat">
            Chat with 네잎 ✨
          </Link>
          <a
            href="https://github.com/CapstoneDesignProject1-team9"
            className="btn btn--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub에서 보기
          </a>
        </div>

        <div className="hero__visual">
          <div className="hero__terminal">
            <div className="hero__terminal-bar">
              <span className="hero__terminal-dot hero__terminal-dot--red" />
              <span className="hero__terminal-dot hero__terminal-dot--yellow" />
              <span className="hero__terminal-dot hero__terminal-dot--green" />
              <span className="hero__terminal-title">four-leaf-AI — zsh</span>
            </div>
            <div className="hero__terminal-body">
              <span className="line">
                <span className="prompt">$ </span>
                <span className="command">curl -X POST /api/v1/tutor/chat \</span>
              </span>
              <span className="line">
                <span className="command">  -d '{`{"message": "복수전공 신청 기준이 어떻게 되나요?"}`}'</span>
              </span>
              <span className="line">&nbsp;</span>
              <span className="line">
                <span className="success">✓ </span>
                <span className="highlight">RAG 검색 완료</span>
                <span className="output"> — 3개 문서에서 근거 확인</span>
              </span>
              <span className="line">&nbsp;</span>
              <span className="line">
                <span className="output">{`{`}</span>
              </span>
              <span className="line">
                <span className="output">  "answer": "</span>
                <span className="command">복수전공 신청은 2학년 1학기부터 가능하며,</span>
              </span>
              <span className="line">
                <span className="command">            평점 3.0 이상이어야 합니다.</span>
                <span className="output">",</span>
              </span>
              <span className="line">
                <span className="output">  "sources": [</span>
                <span className="highlight">"학사규정.pdf"</span>
                <span className="output">, </span>
                <span className="highlight">"FAQ.txt"</span>
                <span className="output">]</span>
              </span>
              <span className="line">
                <span className="output">{`}`}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── Features: 2-Track ─── */}
      <section className="section" id="features" ref={addRevealRef}>
        <div className="container reveal" ref={addRevealRef}>
          <p className="section__eyebrow">2-Track Service</p>
          <h2 className="section__title">
            학생에게는 <span className="text-gradient">AI 튜터</span>,<br />
            교수에게는 <span className="text-gradient">AI 어드바이저</span>.
          </h2>
          <p className="section__description">
            단순 챗봇을 넘어 학습자와 교수자 모두를 지원하는
            양방향 워크플로우를 제공합니다.
          </p>
        </div>

        <div className="container">
          <div className="features-grid reveal" ref={addRevealRef}>
            {/* Track 1 */}
            <div className="feature-card">
              <h3 className="feature-card__title">AI 튜터 — 학생용</h3>
              <p className="feature-card__desc">
                대학 내부 문서 기반 RAG로 할루시네이션 없는 24시간 맞춤형 답변을 제공합니다.
              </p>
              <ul className="feature-card__list">
                <li>학사 규정·진로·취업 정보 실시간 질의응답</li>
                <li>답변마다 출처 문서 각주 자동 제공</li>
                <li>세션 기반 멀티턴 대화 지원</li>
                <li>파인튜닝 모델로 대학 도메인 특화</li>
              </ul>
            </div>

            {/* Track 2 */}
            <div className="feature-card">
              <h3 className="feature-card__title">AI 어드바이저 — 교수용</h3>
              <p className="feature-card__desc">
                학생 질문 패턴을 AI가 분석하여 교수자에게 구조화된 인사이트를 제공합니다.
              </p>
              <ul className="feature-card__list">
                <li>학생 질문 전반적 요약 (3~4문장)</li>
                <li>핵심 키워드 자동 추출 (3~5개)</li>
                <li>교수자를 위한 맞춤 액션 추천</li>
                <li>JSON 구조화 출력으로 대시보드 연동</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── Pipeline ─── */}
      <section className="section" id="pipeline">
        <div className="container text-center reveal" ref={addRevealRef}>
          <p className="section__eyebrow">End-to-End AI Pipeline</p>
          <h2 className="section__title">
            데이터 생성부터 서빙까지,<br />
            <span className="text-gradient">완전한 파이프라인</span>.
          </h2>
          <p className="section__description section__description--centered">
            단순 API 호출이 아닌 — 합성 데이터 생성, 오픈소스 LLM 파인튜닝,
            RAG 서빙까지 모든 과정을 직접 구축했습니다.
          </p>
        </div>

        <div className="container">
          <div className="pipeline reveal" ref={addRevealRef}>
            <div className="pipeline__stage">
              <div className="pipeline__number">1</div>
              <h3 className="pipeline__stage-title">Data Generation</h3>
              <p className="pipeline__stage-tech">Gemini API + LangChain</p>
              <p className="pipeline__stage-desc">
                대학 학사 규정, 공지사항 등 원천 텍스트로부터
                Gemini가 고품질 Instruction Q&A 데이터셋을
                JSONL 형태로 자동 생성합니다.
              </p>
            </div>

            <div className="pipeline__stage">
              <div className="pipeline__number">2</div>
              <h3 className="pipeline__stage-title">Fine-Tuning</h3>
              <p className="pipeline__stage-tech">Llama-3 Bllossom + QLoRA</p>
              <p className="pipeline__stage-desc">
                한국어에 강한 Bllossom 8B 모델을
                A100 GPU에서 4bit QLoRA 방식으로
                대학 도메인에 특화 파인튜닝합니다.
              </p>
            </div>

            <div className="pipeline__stage">
              <div className="pipeline__number">3</div>
              <h3 className="pipeline__stage-title">RAG Serving</h3>
              <p className="pipeline__stage-tech">FastAPI + ChromaDB</p>
              <p className="pipeline__stage-desc">
                KR-ELECTRA 임베딩 + ChromaDB 벡터 검색으로
                근거 문서를 찾아 파인튜닝 모델이
                답변과 출처를 함께 생성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── Architecture ─── */}
      <section className="section" id="architecture">
        <div className="container reveal" ref={addRevealRef}>
          <p className="section__eyebrow">System Architecture</p>
          <h2 className="section__title">
            <span className="text-gradient">AWS</span> 위에 구축된<br />
            프로덕션 아키텍처.
          </h2>
          <p className="section__description">
            4개 독립 레포지토리, GitHub Actions CI/CD,
            AWS ECR 기반 자동 배포 파이프라인.
          </p>
        </div>

        <div className="container">
          <pre className="arch-diagram reveal" ref={addRevealRef}>
            {`  ┌─────────────────────────────────────────────────┐
  │  `}<span className="accent">AWS EC2</span>{` (Ubuntu) — Docker Compose               │
  │                                                   │
  │  ┌───────────────────────────────────────────┐    │
  │  │  `}<span className="blue">Nginx 1.27</span>{`  (리버스 프록시, HTTPS)         │    │
  │  │   ├── /      → `}<span className="accent">Frontend</span>{`  (React 19)  :3000  │    │
  │  │   ├── /api/  → `}<span className="yellow">Backend</span>{`   (Spring)   :8080  │    │
  │  │   └── /ai/   → `}<span className="blue">AI 서비스</span>{` (FastAPI)  :8000  │    │
  │  └───────────────────────────────────────────┘    │
  │                                                   │
  │  `}<span className="dim">PostgreSQL 16  ·  Redis 7  ·  ChromaDB</span>{`          │
  └─────────────────────────────────────────────────┘`}
          </pre>
        </div>

        <div className="container">
          <div className="tech-grid reveal" ref={addRevealRef}>
            <div className="tech-item">
              <span className="tech-item__icon">⚛️</span>
              <div className="tech-item__name">React 19</div>
              <div className="tech-item__desc">TypeScript + Vite 8</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">🍃</span>
              <div className="tech-item__name">Spring Boot 3.3</div>
              <div className="tech-item__desc">Java 21 + JPA</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">⚡</span>
              <div className="tech-item__name">FastAPI</div>
              <div className="tech-item__desc">LangChain 0.3 + RAG</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">🦙</span>
              <div className="tech-item__name">Llama-3 Bllossom</div>
              <div className="tech-item__desc">QLoRA Fine-Tuning</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">🔍</span>
              <div className="tech-item__name">ChromaDB</div>
              <div className="tech-item__desc">KR-ELECTRA 임베딩</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">🐘</span>
              <div className="tech-item__name">PostgreSQL 16</div>
              <div className="tech-item__desc">사용자 데이터 영속화</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">🚀</span>
              <div className="tech-item__name">AWS EC2</div>
              <div className="tech-item__desc">ECR + Docker Compose</div>
            </div>
            <div className="tech-item">
              <span className="tech-item__icon">🔄</span>
              <div className="tech-item__name">GitHub Actions</div>
              <div className="tech-item__desc">4-Repo CI/CD</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── Getting Started ─── */}
      <section className="section" id="get-started">
        <div className="container text-center reveal" ref={addRevealRef}>
          <p className="section__eyebrow">Getting Started</p>
          <h2 className="section__title">
            5분이면 충분합니다.
          </h2>
          <p className="section__description section__description--centered">
            Docker 하나로 전체 스택을 실행하거나,
            각 서비스를 개별적으로 실행할 수 있습니다.
          </p>
        </div>

        <div className="container container--narrow">
          <div className="getting-started reveal" ref={addRevealRef}>
            <div className="getting-started__steps">

              <div className="step">
                <div className="step__number">1</div>
                <div className="step__content">
                  <h4>레포지토리 클론</h4>
                  <div className="step__code">
                    <span className="comment"># 전체 프로젝트 클론</span>{'\n'}
                    <span className="prompt">$ </span>
                    <span className="command">git clone https://github.com/CapstoneDesignProject1-team9/four-leaf-infra.git</span>{'\n'}
                    <span className="prompt">$ </span>
                    <span className="command">cd four-leaf-infra</span>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step__number">2</div>
                <div className="step__content">
                  <h4>환경변수 설정</h4>
                  <div className="step__code">
                    <span className="prompt">$ </span>
                    <span className="command">cp .env.dev.example .env.dev</span>{'\n'}
                    <span className="prompt">$ </span>
                    <span className="command">nano .env.dev</span>
                    <span className="comment">   # API 키, DB 비밀번호 입력</span>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step__number">3</div>
                <div className="step__content">
                  <h4>Docker Compose로 전체 스택 실행</h4>
                  <div className="step__code">
                    <span className="prompt">$ </span>
                    <span className="command">docker compose -f docker-compose.dev.yml up -d --build</span>{'\n'}
                    <span className="comment"># ✅ http://localhost 접속</span>{'\n'}
                    <span className="comment"># ✅ Frontend → /  |  Backend → /api/  |  AI → /ai/</span>
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step__number">4</div>
                <div className="step__content">
                  <h4>AI 튜터에게 질문해보기</h4>
                  <div className="step__code">
                    <span className="prompt">$ </span>
                    <span className="command">{'curl -X POST http://localhost/ai/api/v1/tutor/chat \\'}</span>{'\n'}
                    <span className="command">{'  -H "Content-Type: application/json" \\'}</span>{'\n'}
                    <span className="command">{'  -d \'{"message": "수강신청 기간이 언제야?"}\''}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── CTA ─── */}
      <section className="cta reveal" ref={addRevealRef}>
        <div className="container">
          <h2 className="cta__title">
            함께 만들어갈<br />
            <span className="text-gradient">대학 교육의 미래</span>.
          </h2>
          <p className="cta__desc">
            Four-Leaf는 오픈소스입니다.<br />
            기여하고, 포크하고, 여러분의 대학에 배포하세요.
          </p>
          <div className="cta__actions">
            <a
              href="https://github.com/CapstoneDesignProject1-team9"
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub에서 기여하기
            </a>
            <a href="#hero" className="btn btn--secondary">
              위로 돌아가기 ↑
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="container">
          <p className="footer__text">
            © 2026 Four-Leaf(네잎) - CapstoneDesignProject1 Team 9
          </p>
          <ul className="footer__links">
            <li>
              <a
                href="https://github.com/CapstoneDesignProject1-team9/four-leaf-AI"
                target="_blank"
                rel="noopener noreferrer"
              >
                AI
              </a>
            </li>
            <li>
              <a
                href="https://github.com/CapstoneDesignProject1-team9/four-leaf-backend"
                target="_blank"
                rel="noopener noreferrer"
              >
                Backend
              </a>
            </li>
            <li>
              <a
                href="https://github.com/CapstoneDesignProject1-team9/four-laef-frontend"
                target="_blank"
                rel="noopener noreferrer"
              >
                Frontend
              </a>
            </li>
            <li>
              <a
                href="https://github.com/CapstoneDesignProject1-team9/four-leaf-infra"
                target="_blank"
                rel="noopener noreferrer"
              >
                Infra
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default App
