type Scope = 'visible' | 'hidden';

interface CloudFileDetailsBase {
  id: string;
  name: string;
  /** ISO */
  lastModified: string;
}

type GoogleDriveFileDetails = CloudFileDetailsBase;

interface ICloudFileDetails extends CloudFileDetailsBase {
  isFile: boolean;
  isDirectory: boolean;
  path: string;
  size?: number;
  uri?: string;
}

declare module 'react-native-cloud-fs' {
  const defaultExport: {
    /** iOS only */
    isAvailable: () => Promise<boolean>;

    /** Android only */
    loginIfNeeded: () => Promise<boolean>;

    requestSignIn: () => void;

    /** iOS only
     *
     * (!) Flawed - doesn't help in one call.
     * `listFiles` won't be always ready to return valid info
     *
     * (!) Won't return if `isAvailable` returns false
     *
     * (i) Attempts to load all the iCloud Drive files
     */
    syncCloud: () => Promise<void>;

    logout: () => Promise<boolean>;

    /**
     * (!) Broken - does nothing
     *
     * (!) Don't await - won't return.
     */
    reset: () => Promise<boolean>;

    // getConstants:

    /**
     * (!) Won't return for Android, if not signed-in via `loginIfNeeded`
     */
    listFiles: (options: { scope: Scope; targetPath: string }) => Promise<
      | {
          files?: GoogleDriveFileDetails[];
        }
      | {
          files?: ICloudFileDetails[];
          path: string;
        }
    >;

    /**
     * @returns fileId: string
     */
    copyToCloud: (options: {
      mimeType: string;
      scope: Scope;
      sourcePath: { path: string } | { uri: string };
      targetPath: string;
    }) => Promise<string>;

    fileExists: (
      options:
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

    /**
     * (!) Absent on Android
     *
     * (!) Throws, when file is not found
     *
     * @argument fileName // (!) Yes, filename, not full path!
     */
    getIcloudDocument: (fileName: string) => Promise<string>;
  };

  export default defaultExport;
}
