# 🍀 four-laef-frontend

> **Four-Leaf** 프로젝트의 프론트엔드 서비스입니다.  
> 대학생 AI 튜터 서비스의 사용자 인터페이스를 제공합니다.

---

## 🏗 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 |
| 빌드 도구 | Vite 8 |
| 언어 | TypeScript |
| 린터 | oxlint (Rust 기반, ESLint 대비 50~100배 빠름) |
| 컨테이너 | Docker (nginx:alpine) |
| CI | GitHub Actions |

---

## 🏛 아키텍처

```
사용자 브라우저
      │
      ▼
  Nginx (80/443)  ← four-leaf-infra가 관리
   ├── /        → Frontend  (React SPA)   :3000
   ├── /api/    → Backend   (Spring Boot) :8080
   └── /ai/     → AI 튜터  (FastAPI)     :8000
```

### Docker 이미지 구조 (멀티스테이지)

```
Stage 1: node:20-alpine  → npm ci + vite build → dist/
Stage 2: nginx:1.27-alpine → dist/ 서빙 (포트 3000)
```

> SPA 라우팅을 위해 Nginx가 모든 경로를 `index.html`로 fallback합니다.

---

## 📁 프로젝트 구조

```
four-laef-frontend/
├── .github/
│   └── workflows/
│       ├── ci.yml            # PR/push 시 lint + build 검사
│       └── trigger-cd.yml    # main push 시 ECR push → infra dispatch
├── src/
│   ├── main.tsx              # React 진입점
│   ├── App.tsx               # 루트 컴포넌트
│   └── ...                   # 컴포넌트, 페이지 등 추가 예정
├── public/                   # 정적 파일
├── Dockerfile                # 프로덕션 (nginx 서빙)
├── Dockerfile.dev            # 로컬 개발 (Vite dev server + HMR)
├── vite.config.ts            # Docker HMR 설정 포함
├── tsconfig.json
└── package.json
```

---

## 🔄 CI/CD 파이프라인

### CI (`ci.yml`) — PR + main push

```
npm ci
  → oxlint (린트)
  → tsc --noEmit (타입 체크)
  → vite build (빌드 검증)
```

### CD (`trigger-cd.yml`) — main push만

```
CI 통과
  → Docker image build
  → AWS ECR push (SHA tag + latest)
  → repository_dispatch → four-leaf-infra
    → EC2에 자동 배포
```

---

## 💻 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행 (권장)

```bash
npm run dev
# http://localhost:5173
```

### 3. Docker로 실행 (전체 스택 연동 시)

```bash
# four-leaf-infra 폴더에서
cd ../four-leaf-infra
cp .env.dev.example .env.dev
docker compose -f docker-compose.dev.yml up -d --build
# http://localhost
```

---

## 🔧 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | oxlint 실행 |
| `npm run preview` | 빌드 결과 미리보기 |

---

## 🌐 환경변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `VITE_API_BASE_URL` | `/api` | Backend API 기본 경로 |
| `VITE_AI_BASE_URL` | `/ai` | AI 서비스 기본 경로 |

> Vite 환경변수는 `VITE_` 접두사가 있어야 클라이언트에서 접근 가능합니다.

---

## 🔐 GitHub Secrets (CD 사용 시)

| Secret | 설명 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | ECR push 권한 IAM 키 |
| `AWS_SECRET_ACCESS_KEY` | IAM 시크릿 |
| `INFRA_DISPATCH_TOKEN` | infra 레포 트리거용 PAT |
