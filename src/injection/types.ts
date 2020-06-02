import { InjectableOptions } from '../decorators/Injectable';

export interface ClassInfo<T = any> {
  key?: string;
  constructor?: Class<T>;
  options?: InjectableOptions;
  value?: T;
}
export type Class<T = any> = {new(...args: any[]): T} & Function;
