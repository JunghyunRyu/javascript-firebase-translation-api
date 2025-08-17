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

        // OpenAI Chat Completions API를 사용하여 한국어로 번역
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "당신은 전문 번역가입니다. 주어진 텍스트를 자연스러운 한국어로 번역해주세요. 번역할 때 원문의 의미와 뉘앙스를 최대한 보존하면서도 한국어 문법에 맞게 번역해주세요."
                },
                {
                    role: "user",
                    content: `다음 텍스트를 한국어로 번역해주세요: "${sanitizedMessage}"`
                }
            ],
            max_tokens: 1000,
            temperature: 0.3
        });

        const korean_translated_message = completion.choices[0].message.content;

        response.send({
            "original_message": sanitizedMessage,
            "korean_translated_message": korean_translated_message
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
