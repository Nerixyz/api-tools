import { Class, ClassInfo } from './types';
import { isUndefined } from '../utilities';
import { IllegalArgumentError } from './errors';
import { MetadataKey } from '../decorators/metadata';
import injectInto from './inject-into';

export class DependencyContainer {
  classes: ClassInfo[] = [];

  registerDependency(keyOrInstanceOrProto: string | any | Class, instanceOrProto?: any | Class): this {
    if(isUndefined(instanceOrProto)) {
      if(keyOrInstanceOrProto.prototype) {
        this.registerRawClass(keyOrInstanceOrProto);
      } else if(keyOrInstanceOrProto.constructor) {
        this.registerInstantiatedClass(keyOrInstanceOrProto);
      } else {
        throw new IllegalArgumentError('The first argument has to be either an instance or a class');
      }
    } else if(typeof keyOrInstanceOrProto === 'string') {
      if(instanceOrProto.prototype) {
        this.registerRawClass(instanceOrProto, keyOrInstanceOrProto);
      } else {
        this.registerInstantiatedClass(instanceOrProto, keyOrInstanceOrProto);
      }
    } else {
      throw new IllegalArgumentError('First argument is not a string');
    }
    return this;
  }

  private registerInstantiatedClass(instance: any, key?: string) {
    this.classes.push({
      constructor: instance.constructor,
      options: Reflect.getMetadata(MetadataKey.InjectionOptions, instance.constructor),
      value: instance,
      key,
    });
  }
  private registerRawClass(proto: Class, key?: string) {
    this.classes.push({
      constructor: proto,
      options: Reflect.getMetadata(MetadataKey.InjectionOptions, proto.constructor),
      key,
    });
  }

  inject<T>(target: Class<T>): T {
    return injectInto(target, this.classes);
  }
}
