/**
 * Преобразует файл в строку Base64.
 *
 * @param file - Файл для преобразования.
 * @returns Promise со строкой Base64 или ошибкой, если что-то пошло не так.
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
