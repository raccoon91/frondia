export const mapBy = <T>(array: T[], key: keyof T) => {
  return (
    array?.reduce<Record<string | number, T>>((map, object) => {
      map[object[key] as string | number] = object;

      return map;
    }, {}) ?? {}
  );
};
