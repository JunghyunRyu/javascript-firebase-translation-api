const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const OpenAI = require("openai");

// OpenAI 클라이언트 초기화 - 환경변수에서 API 키 가져오기
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    logger.error("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.");
    throw new Error("OPENAI_API_KEY 환경변수가 필요합니다.");
}

const openai = new OpenAI({
    apiKey: openaiApiKey
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

exports.helloWorld = onRequest((request, response) => {
    setSecurityHeaders(response);
    response.send("Hello World!");
});

exports.christmas = onRequest((request, response) => {
    setSecurityHeaders(response);
    response.send({"message": "Merry Christmas!"});
});

exports.translate = onRequest(async (request, response) => {
    setSecurityHeaders(response);
    
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
        logger.error("번역 중 오류 발생:", error);
        
        // 민감한 정보가 포함된 에러 메시지 필터링
        const errorMessage = error.message.includes('API key') || error.message.includes('authentication') 
            ? "인증 오류가 발생했습니다." 
            : "번역 처리 중 오류가 발생했습니다.";
            
        response.status(500).send({
            error: errorMessage
        });
    }
});
