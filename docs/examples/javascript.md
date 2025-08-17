# 📝 JavaScript 사용 예시

AI 번역 서비스의 JavaScript 사용 예시들을 제공합니다.

## 🔗 기본 설정

### Fetch API 사용

```javascript
const API_BASE_URL = 'https://your-project.cloudfunctions.net';

// 기본 설정
const config = {
    baseURL: API_BASE_URL,
    timeout: 10000, // 10초
    headers: {
        'Content-Type': 'application/json'
    }
};
```

## 📚 번역 API 사용 예시

### 1. 기본 번역 요청

```javascript
async function translateText(text) {
    try {
        const response = await fetch(`${API_BASE_URL}/translate?message=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.korean_translated_message;
    } catch (error) {
        console.error('번역 오류:', error);
        throw error;
    }
}

// 사용 예시
translateText('Hello, world!')
    .then(result => console.log('번역 결과:', result))
    .catch(error => console.error('오류:', error));
```

### 2. 에러 처리와 함께 사용

```javascript
async function translateWithErrorHandling(text) {
    try {
        const response = await fetch(`${API_BASE_URL}/translate?message=${encodeURIComponent(text)}`);
        const data = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                original: data.original_message,
                translated: data.korean_translated_message
            };
        } else {
            return {
                success: false,
                error: data.error,
                status: response.status
            };
        }
    } catch (error) {
        return {
            success: false,
            error: '네트워크 오류가 발생했습니다.',
            details: error.message
        };
    }
}

// 사용 예시
translateWithErrorHandling('Hello, world!')
    .then(result => {
        if (result.success) {
            console.log('원문:', result.original);
            console.log('번역:', result.translated);
        } else {
            console.error('오류:', result.error);
        }
    });
```

### 3. 배치 번역 (여러 텍스트)

```javascript
async function translateBatch(texts) {
    const results = [];
    
    for (const text of texts) {
        try {
            const result = await translateText(text);
            results.push({
                original: text,
                translated: result,
                success: true
            });
        } catch (error) {
            results.push({
                original: text,
                error: error.message,
                success: false
            });
        }
        
        // API 호출 간격 조절 (Rate Limiting 방지)
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
}

// 사용 예시
const texts = [
    'Hello, world!',
    'How are you?',
    'Thank you very much!'
];

translateBatch(texts)
    .then(results => {
        results.forEach(result => {
            if (result.success) {
                console.log(`${result.original} → ${result.translated}`);
            } else {
                console.error(`${result.original}: ${result.error}`);
            }
        });
    });
```

## 🌐 브라우저 환경에서 사용

### 1. HTML 페이지에서 사용

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 번역 서비스</title>
</head>
<body>
    <h1>AI 번역 서비스</h1>
    
    <div>
        <label for="inputText">번역할 텍스트:</label>
        <textarea id="inputText" rows="4" cols="50" placeholder="번역할 텍스트를 입력하세요..."></textarea>
    </div>
    
    <button onclick="translate()">번역하기</button>
    
    <div id="result"></div>
    
    <script>
        const API_BASE_URL = 'https://your-project.cloudfunctions.net';
        
        async function translate() {
            const inputText = document.getElementById('inputText').value;
            const resultDiv = document.getElementById('result');
            
            if (!inputText.trim()) {
                resultDiv.innerHTML = '<p style="color: red;">텍스트를 입력해주세요.</p>';
                return;
            }
            
            resultDiv.innerHTML = '<p>번역 중...</p>';
            
            try {
                const response = await fetch(`${API_BASE_URL}/translate?message=${encodeURIComponent(inputText)}`);
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `
                        <h3>번역 결과:</h3>
                        <p><strong>원문:</strong> ${data.original_message}</p>
                        <p><strong>번역:</strong> ${data.korean_translated_message}</p>
                    `;
                } else {
                    resultDiv.innerHTML = `<p style="color: red;">오류: ${data.error}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: red;">네트워크 오류: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

### 2. React 컴포넌트

```jsx
import React, { useState } from 'react';

const TranslationComponent = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = 'https://your-project.cloudfunctions.net';

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError('텍스트를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${API_BASE_URL}/translate?message=${encodeURIComponent(inputText)}`
            );
            const data = await response.json();

            if (response.ok) {
                setTranslatedText(data.korean_translated_message);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="translation-container">
            <h2>AI 번역 서비스</h2>
            
            <div className="input-section">
                <label htmlFor="inputText">번역할 텍스트:</label>
                <textarea
                    id="inputText"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="번역할 텍스트를 입력하세요..."
                    rows={4}
                    cols={50}
                />
            </div>
            
            <button 
                onClick={handleTranslate} 
                disabled={loading}
            >
                {loading ? '번역 중...' : '번역하기'}
            </button>
            
            {error && (
                <div className="error">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            )}
            
            {translatedText && (
                <div className="result">
                    <h3>번역 결과:</h3>
                    <p><strong>원문:</strong> {inputText}</p>
                    <p><strong>번역:</strong> {translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default TranslationComponent;
```

## 🔧 Node.js 환경에서 사용

### 1. Axios 사용

```javascript
const axios = require('axios');

const API_BASE_URL = 'https://your-project.cloudfunctions.net';

async function translateWithAxios(text) {
    try {
        const response = await axios.get(`${API_BASE_URL}/translate`, {
            params: {
                message: text
            },
            timeout: 10000
        });
        
        return response.data.korean_translated_message;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('네트워크 오류가 발생했습니다.');
        }
    }
}

// 사용 예시
translateWithAxios('Hello, world!')
    .then(result => console.log('번역 결과:', result))
    .catch(error => console.error('오류:', error));
```

### 2. Node.js HTTP 모듈 사용

```javascript
const http = require('http');
const https = require('https');
const { URL } = require('url');

function translateWithHTTP(text) {
    return new Promise((resolve, reject) => {
        const url = new URL(`https://your-project.cloudfunctions.net/translate`);
        url.searchParams.append('message', text);
        
        const request = https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (response.statusCode === 200) {
                        resolve(result.korean_translated_message);
                    } else {
                        reject(new Error(result.error));
                    }
                } catch (error) {
                    reject(new Error('응답 파싱 오류'));
                }
            });
        });
        
        request.on('error', (error) => {
            reject(new Error('네트워크 오류'));
        });
        
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('타임아웃'));
        });
    });
}

// 사용 예시
translateWithHTTP('Hello, world!')
    .then(result => console.log('번역 결과:', result))
    .catch(error => console.error('오류:', error));
```

## 🛠️ 유틸리티 함수

### 1. 입력 검증

```javascript
function validateInput(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('텍스트는 문자열이어야 합니다.');
    }
    
    if (text.length > 500) {
        throw new Error('텍스트는 500자를 초과할 수 없습니다.');
    }
    
    if (!text.trim()) {
        throw new Error('텍스트가 비어있습니다.');
    }
    
    return text.trim();
}
```

### 2. 재시도 로직

```javascript
async function translateWithRetry(text, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await translateText(text);
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            
            console.log(`시도 ${attempt} 실패, 재시도 중...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}
```

### 3. 캐싱 기능

```javascript
class TranslationCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 1000;
    }
    
    get(key) {
        return this.cache.get(key);
    }
    
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    has(key) {
        return this.cache.has(key);
    }
}

const translationCache = new TranslationCache();

async function translateWithCache(text) {
    if (translationCache.has(text)) {
        return translationCache.get(text);
    }
    
    const result = await translateText(text);
    translationCache.set(text, result);
    return result;
}
```

## 📊 성능 모니터링

### 1. 응답 시간 측정

```javascript
async function translateWithTiming(text) {
    const startTime = Date.now();
    
    try {
        const result = await translateText(text);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`번역 완료: ${duration}ms`);
        return result;
    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.error(`번역 실패: ${duration}ms`);
        throw error;
    }
}
```

### 2. 성능 통계

```javascript
class PerformanceMonitor {
    constructor() {
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            totalTime: 0,
            averageTime: 0
        };
    }
    
    recordRequest(duration, success) {
        this.stats.totalRequests++;
        this.stats.totalTime += duration;
        this.stats.averageTime = this.stats.totalTime / this.stats.totalRequests;
        
        if (success) {
            this.stats.successfulRequests++;
        } else {
            this.stats.failedRequests++;
        }
    }
    
    getStats() {
        return {
            ...this.stats,
            successRate: (this.stats.successfulRequests / this.stats.totalRequests) * 100
        };
    }
}

const monitor = new PerformanceMonitor();

async function translateWithMonitoring(text) {
    const startTime = Date.now();
    
    try {
        const result = await translateText(text);
        const duration = Date.now() - startTime;
        monitor.recordRequest(duration, true);
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        monitor.recordRequest(duration, false);
        throw error;
    }
}
```

---

**참고**: 이 예시들은 기본적인 사용법을 보여주며, 실제 프로덕션 환경에서는 추가적인 에러 처리와 보안 고려사항이 필요할 수 있습니다.
