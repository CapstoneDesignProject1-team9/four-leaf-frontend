# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 먼저 복사 (레이어 캐시 활용)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 소스 복사 & 빌드
COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_AI_BASE_URL=/ai

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AI_BASE_URL=$VITE_AI_BASE_URL

RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Serve (nginx)
# ─────────────────────────────────────────
FROM nginx:1.27-alpine

# 빌드 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA 라우팅 지원: 모든 경로를 index.html로 fallback
RUN printf 'server {\n\
    listen 3000;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # 정적 파일 캐시\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
