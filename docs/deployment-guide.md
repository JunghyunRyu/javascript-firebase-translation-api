# 🚀 배포 가이드

AI 번역 서비스를 Firebase Cloud Functions에 배포하는 방법을 안내합니다.

## 📋 사전 요구사항

### 1. 개발 환경 설정

- **Node.js**: 22.x 이상 버전 설치
- **Firebase CLI**: 전역 설치 필요
- **Git**: 버전 관리 시스템

### 2. Firebase 프로젝트 설정

1. **Firebase Console**에서 새 프로젝트 생성
2. **Cloud Functions** 활성화
3. **결제 계정** 연결 (Blaze 플랜 필요)

### 3. 로컬 개발 환경

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init functions
```

## 🔧 배포 준비

### 1. 환경변수 설정

#### 로컬 개발 환경

```bash
# Windows PowerShell
cd functions
Copy-Item env.example .env
```

`.env` 파일 편집:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
NODE_ENV=production
```

#### Firebase Functions 환경

Firebase Console에서 환경변수 설정:

1. **Firebase Console** → **Functions** → **설정**
2. **환경변수** 섹션에서 다음 변수 추가:

```
OPENAI_API_KEY = your_actual_openai_api_key_here
NODE_ENV = production
```

### 2. Firebase 프로젝트 설정

```bash
# Windows PowerShell
Copy-Item .firebaserc.example .firebaserc
```

`.firebaserc` 파일 편집:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### 3. 의존성 설치

```bash
cd functions
npm install
```

## 🚀 배포 과정

### 1. 로컬 테스트

배포 전 로컬에서 테스트:

```bash
# Firebase 에뮬레이터 실행
npm run serve

# 새 터미널에서 테스트
curl "http://localhost:5001/your-project/us-central1/translate?message=Hello"
```

### 2. 프로덕션 배포

```bash
# functions 디렉토리에서
npm run deploy

# 또는 루트 디렉토리에서
firebase deploy --only functions
```

### 3. 배포 확인

```bash
# 배포된 함수 목록 확인
firebase functions:list

# 함수 로그 확인
firebase functions:log
```

## 🔍 배포 후 검증

### 1. API 테스트

```bash
# 번역 API 테스트
curl "https://your-project.cloudfunctions.net/translate?message=Hello%20world"

# 테스트 API 테스트
curl "https://your-project.cloudfunctions.net/helloWorld"
curl "https://your-project.cloudfunctions.net/christmas"
```

### 2. Firebase Console 확인

1. **Functions** 페이지에서 함수 상태 확인
2. **로그**에서 오류 메시지 확인
3. **사용량**에서 호출 횟수 및 응답 시간 확인

## 🔄 업데이트 배포

### 1. 코드 변경 후 배포

```bash
# 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 배포
npm run deploy
```

### 2. 롤백 방법

```bash
# 이전 버전으로 롤백
firebase functions:rollback

# 특정 버전으로 롤백
firebase functions:rollback --version 1
```

## 📊 모니터링 및 관리

### 1. 성능 모니터링

Firebase Console에서 확인 가능한 지표:

- **호출 횟수**: 일별/월별 함수 호출 수
- **응답 시간**: 평균 응답 시간
- **에러율**: 실패한 요청 비율
- **메모리 사용량**: 함수 메모리 사용량

### 2. 로그 관리

```bash
# 실시간 로그 확인
firebase functions:log --follow

# 특정 함수 로그만 확인
firebase functions:log --only translate

# 오류 로그만 확인
firebase functions:log --level error
```

### 3. 알림 설정

Firebase Console에서 알림 설정:

1. **Functions** → **설정** → **알림**
2. 다음 조건에 대한 알림 설정:
   - 함수 실행 실패
   - 응답 시간 초과
   - 메모리 사용량 초과

## 🔒 보안 설정

### 1. 환경변수 보안

- **절대 코드에 API 키 하드코딩 금지**
- **환경변수는 Firebase Console에서만 설정**
- **정기적으로 API 키 로테이션**

### 2. 접근 제어

```bash
# 함수 공개 설정 확인
firebase functions:config:get

# 함수 공개 설정 변경
firebase functions:config:set public=true
```

### 3. CORS 설정

필요한 경우 CORS 설정 추가:

```javascript
// functions/index.js에 추가
const cors = require('cors')({origin: true});

exports.translate = onRequest((request, response) => {
  return cors(request, response, () => {
    // 기존 코드
  });
});
```

## 🚨 문제 해결

### 일반적인 배포 문제

#### 1. 메모리 부족 오류

```bash
# 함수 메모리 설정 증가
firebase functions:config:set memory=512MB
```

#### 2. 타임아웃 오류

```bash
# 함수 타임아웃 설정 증가
firebase functions:config:set timeout=60s
```

#### 3. API 키 오류

```bash
# 환경변수 확인
firebase functions:config:get

# 환경변수 재설정
firebase functions:config:set openai.api_key="your_new_api_key"
```

### 디버깅 방법

#### 1. 로컬 디버깅

```bash
# 디버그 모드로 실행
npm run serve --debug

# 브라우저에서 http://localhost:4000 접속
```

#### 2. 원격 디버깅

```bash
# 원격 디버깅 설정
firebase functions:config:set debug=true
```

## 📈 성능 최적화

### 1. 콜드 스타트 최소화

- **함수 크기 최소화**: 불필요한 의존성 제거
- **메모리 설정 최적화**: 적절한 메모리 할당
- **연결 풀링**: 데이터베이스 연결 재사용

### 2. 응답 시간 개선

- **캐싱 구현**: Redis 또는 메모리 캐시 사용
- **비동기 처리**: 긴 작업은 백그라운드에서 처리
- **CDN 활용**: 정적 리소스는 CDN 사용

## 💰 비용 최적화

### 1. 사용량 모니터링

```bash
# 사용량 통계 확인
firebase functions:usage
```

### 2. 비용 절약 팁

- **불필요한 함수 호출 방지**
- **적절한 메모리 설정**
- **캐싱을 통한 중복 요청 방지**

## 📞 지원

배포 중 문제가 발생하면:

1. **Firebase 문서**: [Cloud Functions 문서](https://firebase.google.com/docs/functions)
2. **GitHub Issues**: 프로젝트 이슈 페이지
3. **Firebase 지원**: Firebase Console → 지원

---

**참고**: 이 가이드는 Firebase Cloud Functions의 최신 버전을 기준으로 작성되었습니다.
