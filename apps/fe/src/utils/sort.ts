// Utility function to sort items by the newest
export const sortByNewest = <T extends { [key: string]: any }, U extends keyof T>(
  items: T[],
  sortField: U
): T[] => items.sort((a, b) => -a[sortField].localeCompare(b[sortField]))
