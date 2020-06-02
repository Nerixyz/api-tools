import { ControllerOptions } from '../types';
import { MetadataKey } from './metadata';

export function Controller(path: string): ClassDecorator;
export function Controller(options: ControllerOptions): ClassDecorator;
export function Controller(optionsOrPath: string | ControllerOptions): ClassDecorator {
  return function(target) {
    const options = typeof optionsOrPath === 'string' ? {path: optionsOrPath} : optionsOrPath;
    Reflect.defineMetadata(MetadataKey.Controller, {
      routes: [],
      ...Reflect.getMetadata(MetadataKey.Controller, target),
      ...options,
    }, target);
  }
}
