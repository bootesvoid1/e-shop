export interface IImageKit {
  fileId: string;
  name: string;
  size: number;
  versionInfo: VersionInfo;
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  AITags: any;
}
export interface VersionInfo {
  id: string;
  name: string;
}
