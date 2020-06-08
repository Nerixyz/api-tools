import { ControllerOptions } from '../types';
import { MetadataKey } from './metadata';

export function Controller(path: string): ClassDecorator;
export function Controller(options: Partial<ControllerOptions>): ClassDecorator;
export function Controller(optionsOrPath: string | Partial<ControllerOptions>): ClassDecorator {
  return function(target) {
    const options = typeof optionsOrPath === 'string' ? {path: optionsOrPath} : optionsOrPath;
    Reflect.defineMetadata(MetadataKey.Controller, {
      routes: [],
      ...Reflect.getMetadata(MetadataKey.Controller, target),
      ...options,
    }, target);
  }
}
