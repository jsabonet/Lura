/**
 * Google Maps API Configuration
 */

export const GOOGLE_MAPS_CONFIG = {
  // API Key
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  
  // Geolocation API Configuration
  GEOLOCATION_API: {
    baseUrl: 'https://www.googleapis.com/geolocation/v1/geolocate',
    timeout: 15000,
    considerIp: true,
    includeWifi: true,
    includeCellTowers: true
  },
  
  // Geocoding API Configuration
  GEOCODING_API: {
    baseUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
    timeout: 10000,
    language: 'pt-BR',
    region: 'br'
  },
  
  // Places API Configuration
  PLACES_API: {
    baseUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    timeout: 10000,
    radius: 1000,
    language: 'pt-BR',
    region: 'br'
  },
  
  // IP Geolocation Configuration
  IP_GEOLOCATION: {
    providers: [
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://freegeoip.app/json/'
    ],
    timeout: 8000
  },
  
  // Location Accuracy Thresholds
  ACCURACY_THRESHOLDS: {
    HIGH: 50,      // < 50m
    MEDIUM: 200,   // < 200m
    LOW: 1000,     // < 1000m
    VERY_LOW: 5000 // >= 5000m
  },
  
  // Confidence Scoring Weights
  CONFIDENCE_WEIGHTS: {
    google_geolocation: 0.95,
    google_places: 0.90,
    browser_gps: 0.85,
    ip: 0.60
  },
  
  // Retry Configuration
  RETRY_CONFIG: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    backoffFactor: 2
  },
  
  // Network Information Collection
  NETWORK_INFO: {
    collectWifiInfo: true,
    collectCellInfo: true,
    collectNetworkType: true
  }
} as const;

export type LocationSource = 'google_geolocation' | 'google_places' | 'browser_gps' | 'ip';

export interface NetworkInfo {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  wifi?: {
    macAddress: string;
    signalStrength: number;
    age: number;
  }[];
  cellTowers?: {
    cellId: number;
    locationAreaCode: number;
    mobileCountryCode: number;
    mobileNetworkCode: number;
    age: number;
    signalStrength: number;
  }[];
}

export interface GeolocationRequest {
  homeMobileCountryCode?: number;
  homeMobileNetworkCode?: number;
  radioType?: string;
  carrier?: string;
  considerIp?: boolean;
  cellTowers?: NetworkInfo['cellTowers'];
  wifiAccessPoints?: NetworkInfo['wifi'];
}

export interface GoogleGeolocationResponse {
  location: {
    lat: number;
    lng: number;
  };
  accuracy: number;
}

/**
 * Validates Google Maps API key
 */
export function validateGoogleMapsApiKey(): boolean {
  return !!GOOGLE_MAPS_CONFIG.API_KEY && GOOGLE_MAPS_CONFIG.API_KEY.length > 20;
}

/**
 * Gets network information for enhanced location accuracy
 */
export function getNetworkInfo(): NetworkInfo {
  const networkInfo: NetworkInfo = {};
  
  // Get connection information
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection) {
      networkInfo.type = connection.type;
      networkInfo.effectiveType = connection.effectiveType;
      networkInfo.downlink = connection.downlink;
      networkInfo.rtt = connection.rtt;
    }
  }
  
  return networkInfo;
}

/**
 * Builds geolocation request payload
 */
export function buildGeolocationRequest(): GeolocationRequest {
  const request: GeolocationRequest = {
    considerIp: GOOGLE_MAPS_CONFIG.GEOLOCATION_API.considerIp
  };
  
  // Add network information if available
  const networkInfo = getNetworkInfo();
  
  // Note: WiFi and cell tower information is not directly accessible
  // through web APIs for privacy reasons. This would require native app permissions.
  
  return request;
}

/**
 * Calculates confidence score based on source and accuracy
 */
export function calculateLocationConfidence(
  source: LocationSource,
  accuracy?: number
): number {
  let baseConfidence = GOOGLE_MAPS_CONFIG.CONFIDENCE_WEIGHTS[source];
  
  if (accuracy) {
    // Adjust confidence based on accuracy
    if (accuracy <= GOOGLE_MAPS_CONFIG.ACCURACY_THRESHOLDS.HIGH) {
      baseConfidence *= 1.0;
    } else if (accuracy <= GOOGLE_MAPS_CONFIG.ACCURACY_THRESHOLDS.MEDIUM) {
      baseConfidence *= 0.9;
    } else if (accuracy <= GOOGLE_MAPS_CONFIG.ACCURACY_THRESHOLDS.LOW) {
      baseConfidence *= 0.7;
    } else {
      baseConfidence *= 0.5;
    }
  }
  
  return Math.min(1.0, Math.max(0.0, baseConfidence));
}

/**
 * Formats location source for display
 */
export function formatLocationSource(source: LocationSource): string {
  const sources = {
    google_geolocation: 'Google Geolocation',
    google_places: 'Google Places',
    browser_gps: 'Browser GPS',
    ip: 'IP Location'
  };
  
  return sources[source] || 'Unknown';
}

/**
 * Gets accuracy description
 */
export function getAccuracyDescription(accuracy?: number): string {
  if (!accuracy) return 'Desconhecida';
  
  if (accuracy <= GOOGLE_MAPS_CONFIG.ACCURACY_THRESHOLDS.HIGH) {
    return 'Muito Alta';
  } else if (accuracy <= GOOGLE_MAPS_CONFIG.ACCURACY_THRESHOLDS.MEDIUM) {
    return 'Alta';
  } else if (accuracy <= GOOGLE_MAPS_CONFIG.ACCURACY_THRESHOLDS.LOW) {
    return 'Média';
  } else {
    return 'Baixa';
  }
}
