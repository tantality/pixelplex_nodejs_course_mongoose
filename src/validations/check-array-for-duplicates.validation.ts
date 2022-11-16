export const checkArrayForDuplicates = <T>(arr: Array<T>): Array<T> => {
  const set = new Set<T>(arr);
  const isArrayContainDuplicates = set.size !== arr.length;
  if (isArrayContainDuplicates) {
    throw new Error('Array must contain unique elements');
  }
  return arr;
};
