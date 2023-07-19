export const truncateStr = (str: string, len: number): string => {
  if (str.length > len) {
    return str.slice(0, len) + "...";
  }
  return str;
};
