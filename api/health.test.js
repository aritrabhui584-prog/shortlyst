import { describe, expect, it } from 'vitest';
import handler from './health';

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

describe('health endpoint', () => {
  it('returns ok for GET requests', () => {
    const res = createResponse();

    handler({ method: 'GET' }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('rejects unsupported methods', () => {
    const res = createResponse();

    handler({ method: 'POST' }, res);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET');
  });
});
