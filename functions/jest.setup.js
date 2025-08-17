// Jest 설정 파일
process.env.NODE_ENV = 'test';

// OpenAI API 키 모킹
process.env.OPENAI_API_KEY = 'test-api-key';

// Firebase Functions 테스트 환경 설정
const { setTestEnv } = require('firebase-functions-test');
setTestEnv();

