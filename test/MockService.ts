import { Injectable } from '../src/decorators/Injectable';

export class MockSubService {
  toString() {
    return 'sub-service';
  }
}

@Injectable()
export class MockService {
  constructor(private sub: MockSubService) {}
  toString() {
    return this.sub?.toString();
  }
}
