import { Class, ClassInfo } from './types';
import { MetadataKey } from '../decorators/metadata';

export default function injectInto<T>(target: Class<T>, classes: ClassInfo[]): T {
  if(!target.length) return new target();

  const reflectParamtypes = Reflect.getMetadata('design:paramtypes', target) ?? [];
  const ownParamtypes = Reflect.getMetadata(MetadataKey.SelfParams, target) ?? [];
  const merged = mergeParamtypes(reflectParamtypes, ownParamtypes);

  const params = merged.map(param => {
    if(!param) return undefined;

    if(typeof param === 'string') {
      return classes.find(x => x.key === param)?.value;
    } else {
      const info = classes.find(x => x.constructor === param);
      if(!info) {
        const value = injectInto(param, classes);
        classes.push({
          constructor: param,
          value
        });
        return value;
      } else {
        if(!info.value) {
          info.value = injectInto(param, classes);
        }
        return info.value;
      }
    }
  });
  return new target(...params);
}

function mergeParamtypes(reflect: Class[], own: Array<{index: number, key: string}>): Array<string | Class> {
  const out = new Array(reflect.length);
  for(let i = 0; i < reflect.length; i++) {
    out[i] = own.find(x => x.index === i)?.key ?? reflect[i];
  }
  return out;
}
