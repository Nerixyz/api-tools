import { Controller } from '../src';
import { ApiRequest } from '../src';
import { Get } from '../src';
import { MockService } from './MockService';

@Controller('/mock')
export class MockController {

  constructor(public service: MockService) {}

  @Get('/:mockId/mock')
  mock(request: ApiRequest) {
    return {param: request.urlParams.mockId, service: this.service?.toString()};
  }
}
