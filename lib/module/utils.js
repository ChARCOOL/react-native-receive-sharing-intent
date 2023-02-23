function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import MimeTypes from './mimeTypes';
class Utils {
  constructor() {
    _defineProperty(this, "getFileName", file => {
      return file.replace(/^.*(\\|\/|\:)/, '');
    });
    _defineProperty(this, "getExtension", fileName => {
      return fileName.substr(fileName.lastIndexOf('.') + 1);
    });
    _defineProperty(this, "getMimeType", file => {
      const fileExtension = this.getExtension(file);
      const fileExtensionClean = '.' + fileExtension.toLowerCase();
      const type = Object.entries(MimeTypes).find(_ref => {
        let [extension] = _ref;
        return extension === fileExtensionClean;
      });
      if (type) return type[1];
      return '';
    });
  }
  sortData(data) {
    const objects = {
      filePath: null,
      text: null,
      weblink: null,
      mimeType: null,
      contentUri: null,
      fileName: null,
      extension: null
    };
    const file = data;
    if (file.startsWith('text:')) {
      const text = file.replace('text:', '');
      if (text.startsWith('http')) {
        const object = [{
          ...objects,
          weblink: text
        }];
        return object;
      }
      let object = [{
        ...objects,
        text: text
      }];
      return object;
    } else if (file.startsWith('webUrl:')) {
      const weblink = file.replace('webUrl:', '');
      const object = [{
        ...objects,
        weblink: weblink
      }];
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
            filePath: path
          };
          object.push(obj);
        }
        return object;
      } catch (error) {
        return [{
          ...objects
        }];
      }
    }
  }
}
export default Utils;
//# sourceMappingURL=utils.js.map