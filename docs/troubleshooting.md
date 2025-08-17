# 🚨 문제 해결 가이드

AI 번역 서비스 사용 중 발생할 수 있는 일반적인 문제들과 해결 방법을 안내합니다.

## 🔍 일반적인 문제들

### 1. API 키 관련 문제

#### 문제: "인증 오류가 발생했습니다"

**증상:**
- API 응답에서 500 에러
- "인증 오류가 발생했습니다" 메시지

**원인:**
- OpenAI API 키가 설정되지 않음
- API 키가 잘못됨
- API 키가 만료됨

**해결 방법:**

1. **환경변수 확인**
   ```bash
   # 로컬 환경
   echo $OPENAI_API_KEY
   
   # Firebase 환경
   firebase functions:config:get
   ```

2. **API 키 재설정**
   ```bash
   # 로컬 환경
   # .env 파일에서 API 키 확인
   
   # Firebase 환경
   firebase functions:config:set openai.api_key="your_new_api_key"
   ```

3. **OpenAI 계정 확인**
   - [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키 상태 확인
   - 결제 정보 확인
   - 사용량 한도 확인

#### 문제: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다"

**해결 방법:**
```bash
# functions 디렉토리에서
Copy-Item env.example .env
# .env 파일 편집하여 실제 API 키 입력
```

### 2. 배포 관련 문제

#### 문제: 배포 실패

**증상:**
- `firebase deploy` 명령어 실행 시 오류
- 함수가 배포되지 않음

**해결 방법:**

1. **Firebase CLI 업데이트**
   ```bash
   npm install -g firebase-tools@latest
   ```

2. **로그인 상태 확인**
   ```bash
   firebase login --reauth
   ```

3. **프로젝트 설정 확인**
   ```bash
   firebase projects:list
   firebase use your-project-id
   ```

4. **의존성 재설치**
   ```bash
   cd functions
   rm -rf node_modules package-lock.json
   npm install
   ```

#### 문제: 함수가 배포되었지만 동작하지 않음

**해결 방법:**

1. **함수 상태 확인**
   ```bash
   firebase functions:list
   ```

2. **로그 확인**
   ```bash
   firebase functions:log --only translate
   ```

3. **URL 확인**
   - 올바른 함수 URL 사용 확인
   - 프로젝트 ID가 정확한지 확인

### 3. 입력 검증 문제

#### 문제: "메시지는 문자열이어야 하며, 500자를 초과할 수 없습니다"

**해결 방법:**
- 메시지 길이를 500자 이하로 줄이기
- 문자열 타입 확인
- 특수 문자 인코딩 확인

#### 문제: "유효한 메시지가 아닙니다"

**해결 방법:**
- HTML 태그 제거
- 빈 문자열이나 공백만 있는 경우 처리
- 특수 문자 필터링

### 4. 성능 문제

#### 문제: 응답 시간이 느림

**증상:**
- API 응답이 3초 이상 걸림
- 타임아웃 오류 발생

**해결 방법:**

1. **메모리 설정 증가**
   ```bash
   firebase functions:config:set memory=512MB
   ```

2. **타임아웃 설정 증가**
   ```bash
   firebase functions:config:set timeout=60s
   ```

3. **캐싱 구현**
   ```javascript
   // 자주 사용되는 번역 결과 캐싱
   const cache = new Map();
   ```

#### 문제: 메모리 부족 오류

**해결 방법:**
```bash
# 함수 메모리 설정 증가
firebase functions:config:set memory=1GB
```

### 5. 네트워크 문제

#### 문제: CORS 오류

**증상:**
- 브라우저에서 API 호출 시 CORS 오류
- "Access to fetch at ... from origin ... has been blocked by CORS policy"

**해결 방법:**

1. **CORS 설정 추가**
   ```javascript
   const cors = require('cors')({origin: true});
   
   exports.translate = onRequest((request, response) => {
     return cors(request, response, () => {
       // 기존 코드
     });
   });
   ```

2. **헤더 설정 확인**
   ```javascript
   response.set({
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type'
   });
   ```

#### 문제: 네트워크 연결 오류

**해결 방법:**
- 인터넷 연결 확인
- 방화벽 설정 확인
- VPN 사용 중인 경우 해제

## 🔧 디버깅 방법

### 1. 로컬 디버깅

#### Firebase 에뮬레이터 사용

```bash
# 에뮬레이터 실행
npm run serve

# 디버그 모드로 실행
npm run serve --debug
```

#### 로그 확인

```bash
# 실시간 로그 확인
firebase functions:log --follow

# 특정 함수 로그만 확인
firebase functions:log --only translate

# 오류 로그만 확인
firebase functions:log --level error
```

### 2. 원격 디버깅

#### Firebase Console 사용

1. **Firebase Console** → **Functions** → **로그**
2. **실시간 로그** 확인
3. **오류 메시지** 분석

#### 환경변수 확인

```bash
# 현재 설정된 환경변수 확인
firebase functions:config:get

# 환경변수 설정
firebase functions:config:set key=value

# 환경변수 삭제
firebase functions:config:unset key
```

### 3. 테스트 방법

#### API 테스트

```bash
# 기본 테스트
curl "https://your-project.cloudfunctions.net/helloWorld"

# 번역 API 테스트
curl "https://your-project.cloudfunctions.net/translate?message=Hello"

# 오류 테스트
curl "https://your-project.cloudfunctions.net/translate"
```

#### Postman 사용

1. **새 요청 생성**
2. **GET 메서드 선택**
3. **URL 입력**: `https://your-project.cloudfunctions.net/translate?message=Hello`
4. **요청 전송**

## 📊 모니터링

### 1. 성능 모니터링

#### Firebase Console에서 확인

- **호출 횟수**: 일별/월별 함수 호출 수
- **응답 시간**: 평균 응답 시간
- **에러율**: 실패한 요청 비율
- **메모리 사용량**: 함수 메모리 사용량

#### 사용량 통계

```bash
# 사용량 통계 확인
firebase functions:usage

# 특정 기간 사용량 확인
firebase functions:usage --start-date 2024-01-01 --end-date 2024-01-31
```

### 2. 알림 설정

#### Firebase Console에서 설정

1. **Functions** → **설정** → **알림**
2. **조건 설정**:
   - 함수 실행 실패
   - 응답 시간 초과
   - 메모리 사용량 초과

## 🛠️ 고급 문제 해결

### 1. 함수 롤백

```bash
# 이전 버전으로 롤백
firebase functions:rollback

# 특정 버전으로 롤백
firebase functions:rollback --version 1
```

### 2. 함수 삭제

```bash
# 특정 함수 삭제
firebase functions:delete functionName

# 모든 함수 삭제
firebase functions:delete --all
```

### 3. 프로젝트 재설정

```bash
# Firebase 프로젝트 재설정
firebase use --add

# 함수 재배포
firebase deploy --only functions
```

## 📞 지원 요청

### 1. 이슈 생성 시 포함할 정보

- **오류 메시지**: 전체 오류 메시지
- **재현 단계**: 문제를 재현하는 단계
- **환경 정보**: Node.js 버전, Firebase CLI 버전
- **로그**: 관련 로그 파일
- **스크린샷**: 오류 화면 스크린샷

### 2. 지원 채널

- **GitHub Issues**: [프로젝트 이슈 페이지](https://github.com/your-username/ai-translation-service/issues)
- **Firebase 지원**: Firebase Console → 지원
- **문서**: [API 참조 문서](./api-reference.md)

### 3. 커뮤니티 지원

- **Stack Overflow**: `firebase-cloud-functions` 태그
- **Firebase 커뮤니티**: [Firebase 커뮤니티 포럼](https://firebase.google.com/community)

## 🔄 예방적 유지보수

### 1. 정기 점검

- **의존성 업데이트**: `npm update`
- **Firebase CLI 업데이트**: `npm install -g firebase-tools@latest`
- **로그 정리**: 오래된 로그 파일 삭제

### 2. 백업

- **코드 백업**: Git 저장소에 정기적 커밋
- **환경변수 백업**: 설정 파일 백업
- **데이터 백업**: 필요한 경우 데이터 백업

### 3. 성능 최적화

- **캐싱 구현**: 자주 사용되는 결과 캐싱
- **코드 최적화**: 불필요한 코드 제거
- **메모리 최적화**: 적절한 메모리 설정

---

**참고**: 이 가이드는 일반적인 문제들을 다루며, 특정 문제에 대한 추가 지원이 필요하면 이슈를 생성해주세요.
