/**
 * Преобразует Date в строку вида 'yyyy-mm-dd', например '1995-10-18'
 *
 * @param date - Дата типа Date для преобразования в строку
 * @returns Строка 'yyyy-mm-dd'
 */
export const convertDateToString: (date: Date) => string = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};
