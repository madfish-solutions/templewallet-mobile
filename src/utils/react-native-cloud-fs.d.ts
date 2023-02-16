declare module 'react-native-cloud-fs' {
  const defaultExport: {
    /** iOS only */
    isAvailable: () => boolean;

    /** Android only */
    loginIfNeeded: () => Promise<boolean>;

    // requestSignIn:

    // logout:

    // reset:

    // getConstants:

    // listFiles:

    /**
     * @returns fileId: string
     */
    copyToCloud: (details: {
      mimeType: string;
      scope: 'hidden';
      sourcePath: { path: string };
      targetPath: string;
    }) => Promise<string>;

    fileExists: (
      details:
        | {
            // iOS
            scope: 'hidden';
            targetPath: string;
          }
        | {
            // Android
            scope: 'hidden';
            fileId: string;
          }
    ) => Promise<boolean>;

    deleteFromCloud: (fileId: string) => Promise<void>;

    getGoogleDriveDocument: (fileId: string) => Promise<string>;
  };

  export default defaultExport;
}
