import {
  AppState,
  EmitterSubscription,
  Linking,
  NativeEventSubscription,
  NativeModules,
  Platform,
} from 'react-native';
import type {
  IReceiveSharingIntent,
  IUtils,
} from './ReceiveSharingIntent.interfaces';
import Utils from './utils';

const { ReceiveSharingIntent } = NativeModules;

class ReceiveSharingIntentModule implements IReceiveSharingIntent {
  private isIos: boolean;
  private utils: IUtils;

  private linkingSubscription: EmitterSubscription | undefined;
  private appStateSubscription: NativeEventSubscription | undefined;

  constructor() {
    this.isIos = Platform.OS === 'ios';
    this.utils = new Utils();

    this.linkingSubscription = undefined;
    this.appStateSubscription = undefined;
  }

  async getReceivedFiles(
    handler: Function,
    errorHandler: Function,
    protocol: string = 'ShareMedia'
  ) {
    try {
      if (this.isIos) {
        if (!this.linkingSubscription) {
          this.utils.debounce(async () => {
            const URL = await Linking.getInitialURL();
            if (!URL?.startsWith(`${protocol}://dataUrl`)) return;

            await this.getFileNames(handler, errorHandler, URL);
          }, 200);
        }

        this.linkingSubscription = Linking.addEventListener(
          'url',
          async (res) => {
            this.utils.debounce(async () => {
              const URL = res ? res.url : '';
              if (!URL?.startsWith(`${protocol}://dataUrl`)) return;

              await this.getFileNames(handler, errorHandler, URL);
            }, 200);
          }
        );
      } else {
        if (!this.appStateSubscription) {
          await this.getFileNames(handler, errorHandler, '');
        }

        this.appStateSubscription = AppState.addEventListener(
          'change',
          async (status: string) => {
            if (status !== 'active') return;
            await this.getFileNames(handler, errorHandler, '');
          }
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  clearReceivedFiles() {
    ReceiveSharingIntent.clearFileNames();

    if (this.linkingSubscription) {
      this.linkingSubscription.remove();
      this.linkingSubscription = undefined;
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
