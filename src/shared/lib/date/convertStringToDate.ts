/**
 * Преобразует строку 'yyy-mm-dd', например '1995-10-18' в объект Date
 * @param stringDate - Строка вида 'yyy-mm-dd'
 * @returns Объект типа Date
 */
export const convertStringToDate = (stringDate: string): Date | null => {
  return stringDate ? new Date(stringDate) : null;
};
