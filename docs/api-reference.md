# 📚 API 참조 문서

AI 번역 서비스의 모든 API 엔드포인트에 대한 상세한 참조 문서입니다.

## 🔗 기본 URL

```
https://your-project-id.cloudfunctions.net
```

## 🔐 인증

현재 모든 API는 공개적으로 접근 가능합니다. 향후 API 키 인증이 추가될 예정입니다.

## 📋 API 엔드포인트 목록

### 1. 번역 API

#### `GET /translate`

텍스트를 한국어로 번역합니다.

**요청 파라미터:**

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|---------|------|------|------|------|
| `message` | string | ✅ | 번역할 텍스트 (최대 500자) | `Hello world` |

**응답 형식:**

```json
{
  "original_message": "Hello world",
  "korean_translated_message": "안녕하세요 세계"
}
```

**상태 코드:**

- `200 OK`: 성공적인 번역
- `400 Bad Request`: 잘못된 요청 (메시지 누락, 길이 초과 등)
- `500 Internal Server Error`: 서버 오류

**사용 예시:**

```bash
# cURL
curl "https://your-project.cloudfunctions.net/translate?message=Hello%20world"

# JavaScript (Fetch API)
const response = await fetch('https://your-project.cloudfunctions.net/translate?message=Hello%20world');
const data = await response.json();
console.log(data.korean_translated_message);

# Python (requests)
import requests
response = requests.get('https://your-project.cloudfunctions.net/translate', 
                       params={'message': 'Hello world'})
data = response.json()
print(data['korean_translated_message'])
```

**에러 응답 예시:**

```json
{
  "error": "메시지가 필요합니다. 'message' 쿼리 파라미터를 제공해주세요."
}
```

```json
{
  "error": "메시지는 문자열이어야 하며, 500자를 초과할 수 없습니다."
}
```

### 2. 테스트 API

#### `GET /helloWorld`

기본 테스트 엔드포인트입니다.

**응답:**

```
"Hello World!"
```

**사용 예시:**

```bash
curl "https://your-project.cloudfunctions.net/helloWorld"
```

#### `GET /christmas`

크리스마스 메시지를 반환합니다.

**응답:**

```json
{
  "message": "Merry Christmas!"
}
```

**사용 예시:**

```bash
curl "https://your-project.cloudfunctions.net/christmas"
```

## 🔒 보안 헤더

모든 API 응답에는 다음 보안 헤더가 포함됩니다:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`

## 📊 요청 제한

### 입력 제한

- **메시지 길이**: 최대 500자
- **요청 빈도**: 현재 제한 없음 (향후 Rate Limiting 추가 예정)
- **동시 요청**: Firebase Functions 제한에 따름

### 응답 제한

- **번역 결과**: 최대 1000 토큰
- **응답 시간**: 일반적으로 1-3초

## 🚨 에러 코드

| 상태 코드 | 에러 메시지 | 설명 |
|-----------|-------------|------|
| 400 | 메시지가 필요합니다 | `message` 파라미터가 누락됨 |
| 400 | 메시지는 문자열이어야 하며, 500자를 초과할 수 없습니다 | 입력 검증 실패 |
| 400 | 유효한 메시지가 아닙니다 | HTML 태그 제거 후 빈 문자열 |
| 500 | 인증 오류가 발생했습니다 | OpenAI API 키 문제 |
| 500 | 번역 처리 중 오류가 발생했습니다 | 기타 서버 오류 |

## 🔄 버전 관리

현재 API 버전: `v1`

버전 변경 시 하위 호환성을 유지하며, 새로운 버전은 별도 엔드포인트로 제공됩니다.

## 📈 모니터링

### 로그 확인

```bash
# Firebase Functions 로그 확인
firebase functions:log
```

### 성능 모니터링

- **응답 시간**: Firebase Console에서 확인 가능
- **에러율**: Firebase Console에서 확인 가능
- **사용량**: Firebase Console에서 확인 가능

## 🧪 테스트

### Postman 컬렉션

```json
{
  "info": {
    "name": "AI Translation Service API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Translate Text",
      "request": {
        "method": "GET",
        "url": {
          "raw": "https://your-project.cloudfunctions.net/translate?message=Hello world",
          "protocol": "https",
          "host": ["your-project", "cloudfunctions", "net"],
          "path": ["translate"],
          "query": [
            {
              "key": "message",
              "value": "Hello world"
            }
          ]
        }
      }
    }
  ]
}
```

### cURL 테스트 스크립트

```bash
#!/bin/bash

# 번역 API 테스트
echo "번역 API 테스트:"
curl -s "https://your-project.cloudfunctions.net/translate?message=Hello%20world" | jq .

# 테스트 API 테스트
echo -e "\n테스트 API 테스트:"
curl -s "https://your-project.cloudfunctions.net/helloWorld"
echo -e "\n"
curl -s "https://your-project.cloudfunctions.net/christmas" | jq .
```

## 📞 지원

API 사용 중 문제가 발생하면:

1. **로그 확인**: Firebase Console에서 함수 로그 확인
2. **이슈 생성**: GitHub Issues에 상세한 오류 정보와 함께 이슈 생성
3. **문서 확인**: 이 문서와 [README.md](../README.md) 참조

---

**참고**: 이 API는 개발 중이며, 향후 기능이 추가되거나 변경될 수 있습니다.
