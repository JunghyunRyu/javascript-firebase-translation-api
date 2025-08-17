# 보안 설정 가이드

## 🔒 보안 설정

### 1. 환경변수 설정

이 프로젝트는 OpenAI API 키를 사용합니다. 다음 단계를 따라 환경변수를 설정하세요:

#### 로컬 개발 환경
1. `functions/env.example` 파일을 `functions/.env`로 복사
2. `functions/.env` 파일에서 `OPENAI_API_KEY`를 실제 API 키로 변경

```bash
# Windows PowerShell
Copy-Item functions/env.example functions/.env
```

#### Firebase Functions 배포 환경
Firebase Console에서 환경변수를 설정하세요:

1. Firebase Console → Functions → 설정
2. 환경변수 섹션에서 `OPENAI_API_KEY` 추가
3. 실제 OpenAI API 키 값 입력

### 2. Firebase 프로젝트 설정

#### 개발자용 설정
1. `.firebaserc.example` 파일을 `.firebaserc`로 복사
2. `your-firebase-project-id`를 실제 프로젝트 ID로 변경

```bash
# Windows PowerShell
Copy-Item .firebaserc.example .firebaserc
```

### 3. 보안 기능

#### 입력 검증
- 메시지 길이 제한: 500자
- HTML 태그 및 스크립트 제거
- 문자열 타입 검증

#### 보안 헤더
- XSS 방지
- 클릭재킹 방지
- MIME 타입 스니핑 방지
- HTTPS 강제

#### 에러 처리
- 민감한 정보 필터링
- 일반적인 에러 메시지 제공

### 4. 배포 전 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 실제 API 키가 코드에 하드코딩되지 않았는지 확인
- [ ] Firebase 프로젝트 ID가 공개되지 않았는지 확인
- [ ] 모든 보안 헤더가 설정되었는지 확인

### 5. API 키 관리

#### OpenAI API 키
- [OpenAI Platform](https://platform.openai.com/api-keys)에서 생성
- 환경변수로 관리
- 절대 코드에 직접 입력하지 마세요

#### Firebase 프로젝트
- Firebase Console에서 새 프로젝트 생성
- 프로젝트 ID를 환경별로 관리

## 🚨 보안 주의사항

1. **API 키 노출 금지**: 절대 GitHub에 API 키를 직접 업로드하지 마세요
2. **환경변수 사용**: 모든 민감한 정보는 환경변수로 관리하세요
3. **정기적 업데이트**: 의존성 패키지를 정기적으로 업데이트하세요
4. **접근 제한**: Firebase Functions의 접근 권한을 적절히 설정하세요

## 📞 보안 문제 신고

보안 취약점을 발견하셨다면 다음으로 연락해주세요:
- 이슈 생성 시 `[SECURITY]` 태그 사용
- 민감한 정보는 공개하지 마세요
