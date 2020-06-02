import { Inject, Injectable } from '../src/decorators';

@Injectable()
export class NonClassMock {
  constructor(
    @Inject('myString') private myString: string,
    @Inject('myNum') private myNum: number,
    @Inject('myBool') private myBool: boolean,
  ) {}

  toString() {
    return `${this.myString} ${this.myNum} ${this.myBool}`;
  }
}
