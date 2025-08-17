const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const OpenAI = require("openai");
const rateLimit = require("express-rate-limit");

// OpenAI API 키 시크릿 정의
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
    apiKey: openaiApiKey.value()
});

// Rate Limiting 설정
const translationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1분
    max: 10, // IP당 최대 10회 요청
    message: {
        error: "요청이 너무 많습니다. 1분 후에 다시 시도해주세요."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 보안 헤더 설정 함수
const setSecurityHeaders = (response) => {
    response.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    });
};

// 지원 언어 목록
const supportedLanguages = {
    'ko': '한국어',
    'en': '영어',
    'ja': '일본어',
    'zh': '중국어',
    'es': '스페인어',
    'fr': '프랑스어',
    'de': '독일어',
    'ru': '러시아어',
    'pt': '포르투갈어',
    'it': '이탈리아어'
};

exports.helloWorld = onRequest({
    region: 'asia-northeast3',
    memory: '256MiB',
    timeoutSeconds: 30,
    maxInstances: 10,
    secrets: []
}, (request, response) => {
    setSecurityHeaders(response);
    response.send("Hello World!");
});

exports.christmas = onRequest({
    region: 'asia-northeast3',
    memory: '256MiB',
    timeoutSeconds: 30,
    maxInstances: 10,
    secrets: []
}, (request, response) => {
    setSecurityHeaders(response);
    response.send({"message": "Merry Christmas!"});
});

exports.translate = onRequest({
    region: 'asia-northeast3',
    memory: '512MiB',
    timeoutSeconds: 60,
    maxInstances: 20,
    concurrency: 80,
    secrets: [openaiApiKey]
}, async (request, response) => {
    setSecurityHeaders(response);
    
    // Rate Limiting 적용
    translationLimiter(request, response, () => {});
    
    try {
        const message = request.query.message;
        const targetLang = request.query.target || 'ko'; // 기본값: 한국어
        const sourceLang = request.query.source || 'auto'; // 기본값: 자동 감지
        
        // 입력 검증 강화
        if (!message) {
            return response.status(400).send({
                error: "메시지가 필요합니다. 'message' 쿼리 파라미터를 제공해주세요."
            });
        }

        // 메시지 길이 제한 (500자)
        if (typeof message !== 'string' || message.length > 500) {
            return response.status(400).send({
                error: "메시지는 문자열이어야 하며, 500자를 초과할 수 없습니다."
            });
        }

        // HTML 태그 및 스크립트 제거
        const sanitizedMessage = message.replace(/<[^>]*>/g, '').trim();
        
        if (!sanitizedMessage) {
            return response.status(400).send({
                error: "유효한 메시지가 아닙니다."
            });
        }

        if (!supportedLanguages[targetLang]) {
            return response.status(400).send({
                error: `지원하지 않는 언어입니다. 지원 언어: ${Object.keys(supportedLanguages).join(', ')}`
            });
        }

        // 번역 지시사항 생성
        let systemPrompt = "당신은 전문 번역가입니다. 주어진 텍스트를 자연스럽고 정확하게 번역해주세요.";
        
        if (sourceLang === 'auto') {
            systemPrompt += ` 원문의 언어를 자동으로 감지하여 ${supportedLanguages[targetLang]}로 번역해주세요.`;
        } else {
            systemPrompt += ` ${supportedLanguages[sourceLang]}에서 ${supportedLanguages[targetLang]}로 번역해주세요.`;
        }
        
        systemPrompt += " 번역할 때 원문의 의미와 뉘앙스를 최대한 보존하면서도 대상 언어의 문법과 표현에 맞게 번역해주세요.";

        // OpenAI Chat Completions API를 사용하여 번역
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `다음 텍스트를 번역해주세요: "${sanitizedMessage}"`
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        });

        const translated_message = completion.choices[0].message.content;

        response.send({
            "original_message": sanitizedMessage,
            "source_language": sourceLang,
            "target_language": targetLang,
            "translated_message": translated_message,
            "supported_languages": supportedLanguages
        });

    } catch (error) {
        // 구조적 로깅
        logger.error("번역 API 오류", {
            error: error.message,
            stack: error.stack,
            statusCode: 500,
            endpoint: '/translate',
            timestamp: new Date().toISOString()
        });
        
        // 민감한 정보가 포함된 에러 메시지 필터링
        const errorMessage = error.message.includes('API key') || error.message.includes('authentication') 
            ? "인증 오류가 발생했습니다." 
            : "번역 처리 중 오류가 발생했습니다.";
            
        response.status(500).send({
            error: errorMessage
        });
    }
});

// 언어 감지 API
exports.detectLanguage = onRequest({
    region: 'asia-northeast3',
    memory: '256MiB',
    timeoutSeconds: 30,
    maxInstances: 10,
    secrets: [openaiApiKey]
}, async (request, response) => {
    setSecurityHeaders(response);
    
    try {
        const message = request.query.message;
        
        if (!message) {
            return response.status(400).send({
                error: "메시지가 필요합니다. 'message' 쿼리 파라미터를 제공해주세요."
            });
        }

        // 메시지 길이 제한 (1000자)
        if (typeof message !== 'string' || message.length > 1000) {
            return response.status(400).send({
                error: "메시지는 문자열이어야 하며, 1000자를 초과할 수 없습니다."
            });
        }

        // HTML 태그 제거
        const sanitizedMessage = message.replace(/<[^>]*>/g, '').trim();
        
        if (!sanitizedMessage) {
            return response.status(400).send({
                error: "유효한 메시지가 아닙니다."
            });
        }

        // OpenAI를 사용하여 언어 감지
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "당신은 언어 감지 전문가입니다. 주어진 텍스트의 언어를 ISO 639-1 언어 코드로만 응답해주세요. 예: ko, en, ja, zh, es, fr, de, ru, pt, it"
                },
                {
                    role: "user",
                    content: `다음 텍스트의 언어를 감지해주세요: "${sanitizedMessage}"`
                }
            ],
            max_tokens: 10,
            temperature: 0.1
        });

        const detectedLanguage = completion.choices[0].message.content.trim().toLowerCase();

        response.send({
            "original_message": sanitizedMessage,
            "detected_language_code": detectedLanguage,
            "detected_language_name": supportedLanguages[detectedLanguage] || "알 수 없는 언어",
            "confidence": "high",
            "supported_languages": supportedLanguages
        });

    } catch (error) {
        // 구조적 로깅
        logger.error("언어 감지 API 오류", {
            error: error.message,
            stack: error.stack,
            statusCode: 500,
            endpoint: '/detectLanguage',
            timestamp: new Date().toISOString()
        });
        
        response.status(500).send({
            error: "언어 감지 중 오류가 발생했습니다.",
            details: error.message
        });
    }
});
