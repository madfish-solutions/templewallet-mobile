type Scope = 'visible' | 'hidden';

declare module 'react-native-cloud-fs' {
  const defaultExport: {
    /** iOS only */
    isAvailable: () => boolean;

    /** Android only */
    loginIfNeeded: () => Promise<boolean>;

    requestSignIn: () => void;

    /** Broken - doesn't log-out and `loginIfNeeded` won't request account selector */
    logout: () => Promise<boolean>;

    /** Broken - hangs in the runtime and won't return */
    reset: () => Promise<boolean>;

    // getConstants:

    listFiles: (details: { scope: Scope; targetPath: string }) => Promise<{
      files?: {
        id: string;
        name: string;
        /** ISO */
        lastModified: string;
      }[];
    }>;

    /**
     * @returns fileId: string
     */
    copyToCloud: (details: {
      mimeType: string;
      scope: Scope;
      sourcePath: { path: string };
      targetPath: string;
    }) => Promise<string>;

    fileExists: (
      details:
        | {
            // iOS
            scope: Scope;
            targetPath: string;
          }
        | {
            // Android
            scope: Scope;
            fileId: string;
          }
    ) => Promise<boolean>;

    deleteFromCloud: (fileId: string) => Promise<void>;

    getGoogleDriveDocument: (fileId: string) => Promise<string>;

    /** Absent on Android */
    getIcloudDocument: (fileName: string) => Promise<string>;
  };

  export default defaultExport;
}
