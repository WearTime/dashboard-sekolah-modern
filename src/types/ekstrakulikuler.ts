export interface EkstrakulikulerGallery {
  id: string;
  ekstrakulikerId: string;
  imagePath: string;
  caption: string | null;
  order: number;
  createdAt: Date | string;
}

export interface Ekstrakulikuler {
  id: string;
  namaEskul: string;
  pendamping: string;
  ketua: string;
  description: string;
  imagesThumbnail: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  galleries?: EkstrakulikulerGallery[];
}
export interface EkstrakulikulerWithGalleries extends Ekstrakulikuler {
  galleries: EkstrakulikulerGallery[];
}

export interface FilterEkstrakulikulerOptions {
  search: string;
}

export interface GalleryFormData {
  imagePath: string;
  caption?: string;
  order: number;
}
