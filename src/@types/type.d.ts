type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

type CamelizeString<T extends PropertyKey, C extends string = ""> = T extends string
  ? string extends T
    ? string
    : T extends `${infer F}_${infer R}`
      ? CamelizeString<Capitalize<R>, `${C}${F}`>
      : `${C}${T}`
  : T;

type Camelize<T> = { [K in keyof T as CamelizeString<K>]: T[K] };

type GetEdges<T> = T extends { edges: infer N } ? N : never;

type GetNode<T> = T extends { edges: Array<{ node: infer N }> } ? N : never;
