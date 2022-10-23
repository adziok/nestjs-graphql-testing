export type UnPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };
