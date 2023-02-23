import type {
  IReceiveSharingIntent,
  IUtils,
} from './ReceiveSharingIntent.interfaces';
import {
  Platform,
  Linking,
  NativeModules,
  EmitterSubscription,
} from 'react-native';
import Utils from './utils';

const { ReceiveSharingIntent } = NativeModules;

class ReceiveSharingIntentModule implements IReceiveSharingIntent {
  private isIos: boolean;
  private utils: IUtils;

  private subscription: EmitterSubscription | undefined;

  constructor() {
    this.isIos = Platform.OS === 'ios';
    this.utils = new Utils();

    this.subscription = undefined;
  }

  async getReceivedFiles(
    handler: Function,
    errorHandler: Function,
    protocol: string = 'ShareMedia'
  ) {
    try {
      if (this.isIos) {
        const URL = await Linking.getInitialURL();

        if (URL?.startsWith(`${protocol}://dataUrl`)) {
          await this.getFileNames(handler, errorHandler, URL);
        }

        this.subscription = Linking.addEventListener('url', async (res) => {
          const URL = res ? res.url : '';

          if (URL?.startsWith(`${protocol}://dataUrl`)) {
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

  protected async getFileNames(
    handler: Function,
    errorHandler: Function,
    url: string
  ) {
    try {
      if (this.isIos) {
        const data = await ReceiveSharingIntent.getFileNames(url);
        const files = this.utils.sortData(data);
        handler(files);
      } else {
        const fileObject = await ReceiveSharingIntent.getFileNames();
        const files = Object.keys(fileObject).map((key) => fileObject[key]);
        handler(files);
      }
    } catch (error) {
      errorHandler(error);
    }
  }
}

export default ReceiveSharingIntentModule;
