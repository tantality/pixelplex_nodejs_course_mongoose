export const isObjectEmpty = (object: Record<string, unknown>): boolean => {
  const objectKeys = Object.keys(object);
  return !objectKeys.length;
};
