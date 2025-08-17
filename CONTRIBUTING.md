# 🤝 기여 가이드

AI 번역 서비스 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 📋 기여하기 전에

### 개발 환경 설정

1. **Node.js 설치**: Node.js 22.x 이상 버전이 필요합니다.
2. **Firebase CLI 설치**: `npm install -g firebase-tools`
3. **Git 설정**: Git이 설치되어 있어야 합니다.

### 프로젝트 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/ai-translation-service.git
cd ai-translation-service

# 의존성 설치
cd functions
npm install

# 환경변수 설정
Copy-Item env.example .env
# .env 파일을 편집하여 OpenAI API 키 설정
```

## 🔄 기여 워크플로우

### 1. 이슈 생성

기능 요청이나 버그 리포트를 위해 이슈를 생성하세요:

- **버그 리포트**: `[BUG]` 태그 사용
- **기능 요청**: `[FEATURE]` 태그 사용
- **문서 개선**: `[DOCS]` 태그 사용
- **보안 문제**: `[SECURITY]` 태그 사용

### 2. 브랜치 생성

```bash
# 메인 브랜치에서 최신 상태로 업데이트
git checkout main
git pull origin main

# 새로운 기능 브랜치 생성
git checkout -b feature/your-feature-name
# 또는
git checkout -b fix/your-bug-fix
```

### 3. 개발 및 테스트

#### 코드 작성 규칙

- **JavaScript 스타일**: ES6+ 문법 사용
- **함수명**: camelCase 사용
- **상수명**: UPPER_SNAKE_CASE 사용
- **주석**: 한국어로 작성

#### 테스트

```bash
# 로컬 테스트
npm run serve

# 단위 테스트 (추후 추가 예정)
npm test
```

### 4. 커밋

```bash
# 변경사항 스테이징
git add .

# 커밋 메시지 작성
git commit -m "feat: 새로운 번역 기능 추가"
git commit -m "fix: API 응답 오류 수정"
git commit -m "docs: README 업데이트"
```

#### 커밋 메시지 규칙

- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 스타일 변경
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가/수정
- `chore:` 빌드 프로세스 또는 보조 도구 변경

### 5. 푸시 및 Pull Request

```bash
# 브랜치 푸시
git push origin feature/your-feature-name
```

GitHub에서 Pull Request를 생성하세요.

## 📝 Pull Request 가이드라인

### PR 제목 규칙

```
feat: 새로운 번역 언어 지원 추가
fix: API 응답 시간 개선
docs: 설치 가이드 업데이트
```

### PR 설명 템플릿

```markdown
## 변경사항 요약
- 새로운 기능 또는 수정사항을 간단히 설명

## 변경 이유
- 왜 이 변경이 필요한지 설명

## 테스트 방법
- [ ] 로컬에서 테스트 완료
- [ ] API 응답 확인
- [ ] 보안 검증 완료

## 관련 이슈
- Fixes #123
- Related to #456

## 스크린샷 (UI 변경 시)
- 변경 전/후 스크린샷 첨부
```

## 🧪 테스트 가이드라인

### 단위 테스트

```javascript
// functions/test/translate.test.js 예시
const { expect } = require('chai');
const { translate } = require('../index');

describe('번역 API 테스트', () => {
  it('정상적인 번역 요청', async () => {
    // 테스트 코드
  });
  
  it('잘못된 입력 처리', async () => {
    // 테스트 코드
  });
});
```

### 통합 테스트

```bash
# Firebase 에뮬레이터 실행
npm run serve

# API 테스트
curl "http://localhost:5001/your-project/us-central1/translate?message=Hello"
```

## 🔒 보안 기여

보안 취약점을 발견하셨다면:

1. **즉시 이슈 생성**: `[SECURITY]` 태그 사용
2. **민감한 정보 제외**: API 키, 프로젝트 ID 등은 공개하지 마세요
3. **상세한 설명**: 취약점의 영향과 재현 방법을 설명하세요

## 📚 문서 기여

### 문서 작성 규칙

- **한국어 사용**: 모든 문서는 한국어로 작성
- **마크다운 형식**: GitHub 마크다운 문법 사용
- **이미지 첨부**: 스크린샷이나 다이어그램 포함
- **코드 예시**: 실제 동작하는 코드 예시 제공

### 문서 구조

```
docs/
├── api-reference.md      # API 참조 문서
├── deployment-guide.md   # 배포 가이드
├── troubleshooting.md    # 문제 해결 가이드
└── examples/            # 사용 예시
    ├── javascript.md
    ├── python.md
    └── curl.md
```

## 🏷️ 라벨 가이드

### 이슈 라벨

- `bug`: 버그 리포트
- `enhancement`: 기능 개선
- `documentation`: 문서 관련
- `good first issue`: 초보자용 이슈
- `help wanted`: 도움 요청
- `security`: 보안 관련

### PR 라벨

- `ready for review`: 리뷰 준비 완료
- `work in progress`: 작업 중
- `needs review`: 리뷰 필요
- `approved`: 승인됨

## 🎯 기여 영역

### 우선순위 높음

- [ ] 다국어 번역 지원
- [ ] 번역 품질 개선
- [ ] API 응답 속도 최적화
- [ ] 에러 처리 강화

### 우선순위 중간

- [ ] 테스트 코드 작성
- [ ] 문서 개선
- [ ] 코드 리팩토링
- [ ] 성능 모니터링

### 우선순위 낮음

- [ ] UI 개선
- [ ] 추가 기능
- [ ] 예시 코드 추가

## 📞 연락처

- **이슈**: [GitHub Issues](https://github.com/your-username/ai-translation-service/issues)
- **토론**: [GitHub Discussions](https://github.com/your-username/ai-translation-service/discussions)
- **보안**: [SECURITY.md](./SECURITY.md) 참조

## 🙏 감사의 말

모든 기여자분들께 감사드립니다! 여러분의 기여가 이 프로젝트를 더 나은 서비스로 만들어줍니다.

---

**참고**: 이 가이드는 [Contributor Covenant](https://www.contributor-covenant.org/)를 기반으로 작성되었습니다.
