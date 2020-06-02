import { DependencyContainer } from '../src/injection';
import { MockController } from './MockController';
import assert = require('assert');
import { NonClassMock } from './NonClassMock';

describe('Injection', function() {
  it('should inject', function() {
    assert.strictEqual(new DependencyContainer().inject(MockController).service?.toString(), 'sub-service');
  });
  it('should inject non class properties', function() {
    assert.strictEqual(new DependencyContainer()
      .registerDependency('myString', 'test')
      .registerDependency('myNum', 123)
      .registerDependency('myBool', true)
      .inject(NonClassMock).toString(), 'test 123 true');
  });
});
