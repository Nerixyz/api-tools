import { MetadataKey } from './metadata';

export function Inject(key: string) {
  return function(target: any, targetKey: string | symbol, index: number) {
    const meta = Reflect.getMetadata(MetadataKey.SelfParams, target) ?? [];
    meta.push({
      key: key ?? targetKey,
      index
    });
    Reflect.defineMetadata(MetadataKey.SelfParams, meta, target);
  }
}
