import { ChangeEvent } from "react";

export type AnalysisProps = {
  onClose?: () => void;
  onProgressComplete?: () => void;
  fileName: string | undefined;
  refId: string;
};

export type UploadDriveProps = {
  onClose?: () => void;
  onSelected?: (newSelectedFile: any) => void;
  handleSystemButtonClick?: () => void;
  systemUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDriveButtonClick?: () => void;
  fileInputRef?: any;
  selectedDriveVideo?: any;
  selectedDriveImage?: any;
};

export type UploadDriveBrandCanvasProps = {
  onClose?: () => void;
  onSelected?: (newSelectedFile: any) => void;
  handleSystemButtonClick?: () => void;
  systemUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDriveButtonClick?: () => void;
  generateImageButtonClick?: () => void;
  generateVideoButtonClick?: () => void;
  fileInputRef?: any;
  uploadType?: string;
  datanotloaded?: boolean;
  setDriveClickedArray?: any;
  setDriveVideoClickedArray?: any;
  driveClickedArray?: any;
  driveVideoClickedArray?: any;
  selectedClickedArray?: any;
  selectedVideoClickedArray?: any;
  setSelectedClickedArray?: any;
  setSelectedVideoClickedArray?: any;
  targetGroup?: any;
};

export type UploadAdCreativeProps = {
  onClose?: () => void;
  onSelected?: (newSelectedFile: any) => void;
  handleSystemButtonClick?: () => void;
  systemUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDriveButtonClick?: () => void;
  generateImageButtonClick?: () => void;
  generateVideoButtonClick?: () => void;
  setDriveClickedArray?: any;
  driveClickedArray?: any;
  fileInputRef?: any;
  uploadType?: string;
  datanotloaded?: boolean;
};

export type UploadAdManagerProps = {
  onClose?: () => void;
  onSelected?: (newSelectedFile: any) => void;
  handleSystemButtonClick?: () => void;
  systemUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDriveButtonClick?: () => void;
  generateImageButtonClick?: () => void;
  generateVideoButtonClick?: () => void;
  setDriveClickedArray?: any;
  driveClickedArray?: any;
  fileInputRef?: any;
  uploadType?: string;
  datanotloaded?: boolean;
  targetGroup?: any;
  position?:string
};

// Return Data type
export type AnalysisDataType = {
  nyx_upload_token: AnalysisType;
};

export type AnalysisType = {
  uploadId: number;
  userId: number;
  trackType: string;
  genre: string;
  uploadType: string;
  songName: string;
  parameters: Parameters;
  status: string;
  struct_url: string;
};

export type Parameters = {
  original: Original;
  "hit benchmark": Original;
};

export type Original = {
  key: Key;
  group: Group;
};

export type Key = {
  tempo: number;
  song_name?: string;
  lyrics_clarity: number;
  song_duration: number;
  sound_loudness: number;
  energetic_vibes: number;
  danceability_factor: number;
  instrumental_elements: number;
  live_performance_energy: number;
  predicted_popularity_class?: string;
  score?: string;
  hit_probability?: string;
  flop_probability?: string;
  average_probability: string;
  acoustic_presence?: number;
  emotional_appeal?: number;
};

export type Group = {
  mood: Mood;
  properties: Properties;
  context: Context;
};

export type Mood = {
  danceability_factor: number;
  emotional_appeal: number;
  energetic_vibes: number;
  tempo: number;
};

export type Properties = {
  sound_loudness: number;
  lyrics_clarity: number;
  instrumental_elements: number;
};

export type Context = {
  live_performance_energy: number;
  song_duration: number;
  acoustic_presence?: number;
};
