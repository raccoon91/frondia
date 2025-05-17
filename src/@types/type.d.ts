type Nullish<T> = T | null | undefined;

type Nullable<T> = T | null;

type JsonType = string | number | boolean | null | { [key: string]: JsonType | undefined } | JsonType[];
