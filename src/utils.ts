import type { IReturnData, IUtils } from './ReceiveSharingIntent.interfaces';
import MimeTypes from './mimeTypes';

class Utils implements IUtils {
  sortData(data: any): Array<IReturnData> {
    const objects: IReturnData = {
      filePath: null,
      text: null,
      weblink: null,
      mimeType: null,
      contentUri: null,
      fileName: null,
      extension: null,
    };
    const file = data;
    if (file.startsWith('text:')) {
      const text = file.replace('text:', '');
      if (text.startsWith('http')) {
        const object: Array<IReturnData> = [{ ...objects, weblink: text }];
        return object;
      }
      let object = [{ ...objects, text: text }];
      return object;
    } else if (file.startsWith('webUrl:')) {
      const weblink: string = file.replace('webUrl:', '');
      const object: Array<IReturnData> = [{ ...objects, weblink: weblink }];
      return object;
    } else {
      try {
        const files = JSON.parse(file);
        const object = [];
        for (let i = 0; i < files.length; i++) {
          const path = files[i].path;
          const obj = {
            ...objects,
            fileName: this.getFileName(path),
            extension: this.getExtension(path),
            mimeType: this.getMimeType(path),
            filePath: path,
          };
          object.push(obj);
        }
        return object;
      } catch (error) {
        return [{ ...objects }];
      }
    }
  }

  getFileName = (file: string): string => {
    return file.replace(/^.*(\\|\/|\:)/, '');
  };

  getExtension = (fileName: string): string => {
    return fileName.substr(fileName.lastIndexOf('.') + 1);
  };

  getMimeType = (file: string): string => {
    const fileExtension = this.getExtension(file);
    const fileExtensionClean = '.' + fileExtension.toLowerCase();
    const type = Object.entries(MimeTypes).find(
      ([extension]) => extension === fileExtensionClean
    );

    if (type) return type[1];
    return '';
  };
}

export default Utils;
