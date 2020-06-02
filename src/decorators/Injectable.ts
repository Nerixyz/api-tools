import { MetadataKey } from './metadata';

export interface InjectableOptions {
  transient: boolean;
}
export function Injectable(options?: InjectableOptions): ClassDecorator {
  return target => Reflect.defineMetadata(MetadataKey.InjectionOptions, options, target);
}
