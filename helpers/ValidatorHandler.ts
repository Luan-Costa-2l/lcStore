export const useImageValidation = (files: File[]): { errorMessage: string, path: 'images' } => {
  let errorMessage = '';
  if (files.length > 4) {
    errorMessage = 'Selecione no máximo 4 imagens';
  }
  const validedFile = files.some(file => ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type));
  if (files.length > 0 && !validedFile) errorMessage = 'Selecione apenas imagens válidas';

  return { errorMessage, path: 'images' }
}