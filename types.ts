
export interface VibePlace {
  name: string;
  description: string;
  address?: string;
  rating?: number;
  uri: string;
  vibes: string[];
}

// Updated GroundingChunk to be compatible with @google/genai's GroundingChunk 
// where maps properties are optional and other fields may exist.
export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
  };
  web?: {
    uri?: string;
    title?: string;
  };
  [key: string]: any;
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export interface Location {
  latitude: number;
  longitude: number;
}
