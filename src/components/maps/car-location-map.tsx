'use client';

import { GoogleMap } from './google-map';

interface CarLocationMapProps {
  latitude?: number;
  longitude?: number;
  location: string;
  className?: string;
  zoom?: number;
}

// Nigerian cities coordinates
const NIGERIAN_CITY_COORDINATES: Record<string, google.maps.LatLngLiteral> = {
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Abuja': { lat: 9.0765, lng: 7.3986 },
  'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
  'Kano': { lat: 12.0022, lng: 8.5920 },
  'Ibadan': { lat: 7.3775, lng: 3.9470 },
  'Benin City': { lat: 6.3350, lng: 5.6037 },
  'Jos': { lat: 9.8965, lng: 8.8583 },
  'Ilorin': { lat: 8.5370, lng: 4.5520 },
  'Owerri': { lat: 5.4840, lng: 7.0351 },
  'Calabar': { lat: 4.9518, lng: 8.3220 },
  'Enugu': { lat: 6.5244, lng: 7.5186 },
  'Kaduna': { lat: 10.5222, lng: 7.4383 },
  'Zaria': { lat: 11.0804, lng: 7.7076 },
  'Warri': { lat: 5.5160, lng: 5.7500 },
  'Akure': { lat: 7.2571, lng: 5.2058 },
};

export function CarLocationMap({
  latitude,
  longitude,
  location,
  className = "h-64 w-full rounded-lg",
  zoom = 13
}: CarLocationMapProps) {
  // Determine coordinates
  let coordinates: google.maps.LatLngLiteral;

  if (latitude && longitude) {
    // Use provided coordinates
    coordinates = { lat: latitude, lng: longitude };
  } else {
    // Try to find city coordinates
    const cityKey = Object.keys(NIGERIAN_CITY_COORDINATES).find(city =>
      location.toLowerCase().includes(city.toLowerCase())
    );

    coordinates = cityKey
      ? NIGERIAN_CITY_COORDINATES[cityKey]
      : NIGERIAN_CITY_COORDINATES['Lagos']; // Default to Lagos
  }

  return (
    <div className="space-y-2">
      <GoogleMap
        center={coordinates}
        zoom={zoom}
        markers={[coordinates]}
        className={className}
      />
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <span>Car location in {location}</span>
      </div>
    </div>
  );
}