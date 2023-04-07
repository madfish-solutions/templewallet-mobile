declare module 'react-native-cloud-fs' {
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

  export interface TargetPathAndScope {
    scope: Scope;
    targetPath: string;
  }

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
    listFiles: (options: TargetPathAndScope) => Promise<
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
    copyToCloud: (
      options: TargetPathAndScope & {
        mimeType: string;
        sourcePath: { path: string } | { uri: string };
      }
    ) => Promise<string>;

    fileExists: (
      options:
        | TargetPathAndScope // iOS
        | {
            // Android
            scope: Scope;
            fileId: string;
          }
    ) => Promise<boolean>;

    deleteFromCloud: (fileId: string) => Promise<unknown>;

    getGoogleDriveDocument: (fileId: string) => Promise<string>;

    /** iOS only */
    getIcloudDocument: (options: TargetPathAndScope) => Promise<string | undefined>;
  };

  export default defaultExport;
}
