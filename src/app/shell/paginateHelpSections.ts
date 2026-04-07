export function paginateHelpSections<T>(
  sections: readonly T[],
  pageSize: number
) {
  const pages: T[][] = [];

  for (let index = 0; index < sections.length; index += pageSize) {
    pages.push(sections.slice(index, index + pageSize));
  }

  return pages;
}
