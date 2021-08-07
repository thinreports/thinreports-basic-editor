import { Size, ImageData } from '@/types';

const ACCEPT_IMAGE_TYPES = ['image/png', 'image/jpeg'];

const openImageSelectDialog = async () => {
  return new Promise((resolve: (value: File) => void, reject: (reason: Error) => void) => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = ACCEPT_IMAGE_TYPES.join(',');
    input.value = '';
    input.onchange = e => {
      const input = e.target as HTMLInputElement;

      if (input && input.files) {
        resolve(input.files[0]);
      } else {
        reject(new Error('Missing InputElement'));
      }
    };
    input.click();
  });
};

const readAsDataUrl = async (file: Blob) => {
  return new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error occurred reading file'));
    reader.readAsDataURL(file);
  });
};

const calcImageSize = async (dataUrl: string) => {
  return new Promise((resolve: (value: Size) => void) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.width, height: image.height });
    image.src = dataUrl;
  });
};

const extractTypeAndData = (dataUrl: string): ImageData => {
  const data = dataUrl.match(/^data:(.+?);base64,(.+)/);

  if (!data) throw new Error('Invalid image data');

  const mimeType = data[1];
  const base64 = data[2];

  if (mimeType !== 'image/png' && mimeType !== 'image/jpeg') throw new Error(`Invalid image type: ${mimeType}`);

  return { mimeType, base64 };
};

export const selectImage = async () => {
  const file = await openImageSelectDialog();
  const dataUrl = await readAsDataUrl(file);
  const imageSize = await calcImageSize(dataUrl);

  return {
    ...imageSize,
    ...extractTypeAndData(dataUrl)
  };
};
