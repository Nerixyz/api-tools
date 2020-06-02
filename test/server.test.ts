import { ApiServer } from '../src';
import { MockController } from './MockController';
import * as http from 'http';
import assert = require('assert');

describe('ApiServer', () => {
  it('should work', function () {
    const server = new ApiServer().registerController(MockController).build();

    return new Promise((resolve, reject) => {
      http.get('http://localhost:3000/mock/test/mock', res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => (rawData += chunk));
        res.on('end', () => {
          res.statusCode === 200 ? resolve(JSON.parse(rawData)) : reject();
        });
        res.on('error', reject);
      });
    }).then(res => {
      assert.deepStrictEqual(res, {
        param: 'test',
        service: 'sub-service',
      })
    }).finally(() => server.rawServer?.close());
  });
});
