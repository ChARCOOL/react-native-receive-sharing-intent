import type { IReceiveSharingIntent } from './ReceiveSharingIntent.interfaces';
declare class ReceiveSharingIntentModule implements IReceiveSharingIntent {
    private isIos;
    private utils;
    private subscription;
    constructor();
    getReceivedFiles(handler: Function, errorHandler: Function, protocol?: string): Promise<void>;
    clearReceivedFiles(): void;
    protected getFileNames(handler: Function, errorHandler: Function, url: string): Promise<void>;
}
export default ReceiveSharingIntentModule;
//# sourceMappingURL=ReceiveSharingIntent.d.ts.map