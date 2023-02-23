function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { Platform, Linking, NativeModules } from 'react-native';
import Utils from './utils';
const {
  ReceiveSharingIntent
} = NativeModules;
class ReceiveSharingIntentModule {
  constructor() {
    _defineProperty(this, "isIos", void 0);
    _defineProperty(this, "utils", void 0);
    _defineProperty(this, "subscription", void 0);
    this.isIos = Platform.OS === 'ios';
    this.utils = new Utils();
    this.subscription = undefined;
  }
  async getReceivedFiles(handler, errorHandler) {
    let protocol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ShareMedia';
    try {
      if (this.isIos) {
        const URL = await Linking.getInitialURL();
        if (URL !== null && URL !== void 0 && URL.startsWith(`${protocol}://dataUrl`)) {
          await this.getFileNames(handler, errorHandler, URL);
        }
        this.subscription = Linking.addEventListener('url', async res => {
          const URL = res ? res.url : '';
          if (URL !== null && URL !== void 0 && URL.startsWith(`${protocol}://dataUrl`)) {
            await this.getFileNames(handler, errorHandler, URL);
          }
        });
      } else {
        await this.getFileNames(handler, errorHandler, '');
      }
    } catch (error) {
      errorHandler(error);
    }
  }
  clearReceivedFiles() {
    ReceiveSharingIntent.clearFileNames();
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = undefined;
    }
  }
  async getFileNames(handler, errorHandler, url) {
    try {
      if (this.isIos) {
        const data = await ReceiveSharingIntent.getFileNames(url);
        const files = this.utils.sortData(data);
        handler(files);
      } else {
        const fileObject = await ReceiveSharingIntent.getFileNames();
        const files = Object.keys(fileObject).map(key => fileObject[key]);
        handler(files);
      }
    } catch (error) {
      errorHandler(error);
    }
  }
}
export default ReceiveSharingIntentModule;
//# sourceMappingURL=ReceiveSharingIntent.js.map