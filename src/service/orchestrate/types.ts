export interface ImageManifest {
  images: ImageManifestEntry[];
}

export interface ImageManifestEntry {
  id: string;
  tag: string;
  fileName: string;
  fileSizeBytes: number;
  url: string;
}