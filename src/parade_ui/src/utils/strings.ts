export const truncateStr = (str: string): string => {
  if (str.length > 8) {
    return str.slice(0, 8) + "...";
  }
  return str;
};
