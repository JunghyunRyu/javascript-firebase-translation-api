const request = require('supertest');
const { onRequest } = require('firebase-functions-test');
const { translate } = require('../index');

describe('Translation API', () => {
  let testFunction;

  beforeAll(() => {
    testFunction = onRequest(translate);
  });

  afterAll(() => {
    testFunction.cleanup();
  });

  describe('GET /translate', () => {
    it('should translate English text to Korean', async () => {
      const response = await request(testFunction)
        .get('/translate')
        .query({ message: 'Hello, world!' })
        .expect(200);

      expect(response.body).toHaveProperty('original_message');
      expect(response.body).toHaveProperty('korean_translated_message');
      expect(response.body.original_message).toBe('Hello, world!');
      expect(typeof response.body.korean_translated_message).toBe('string');
    });

    it('should return 400 when message is missing', async () => {
      const response = await request(testFunction)
        .get('/translate')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('메시지가 필요합니다');
    });

    it('should return 400 when message is empty', async () => {
      const response = await request(testFunction)
        .get('/translate')
        .query({ message: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when message is too long', async () => {
      const longMessage = 'a'.repeat(501);
      const response = await request(testFunction)
        .get('/translate')
        .query({ message: longMessage })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('500자를 초과할 수 없습니다');
    });

    it('should sanitize HTML tags from input', async () => {
      const response = await request(testFunction)
        .get('/translate')
        .query({ message: '<script>alert("test")</script>Hello' })
        .expect(200);

      expect(response.body.original_message).toBe('Hello');
    });

    it('should include security headers', async () => {
      const response = await request(testFunction)
        .get('/translate')
        .query({ message: 'Hello' })
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });
});

