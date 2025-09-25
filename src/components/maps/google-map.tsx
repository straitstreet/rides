'use client';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useRef, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: google.maps.LatLngLiteral[];
  className?: string;
  onMapClick?: (location: google.maps.LatLngLiteral) => void;
}

function MapComponent({ center, zoom, markers = [], onMapClick, className }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      if (onMapClick) {
        newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }
        });
      }

      setMap(newMap);
    }
  }, [ref, map, center, zoom, onMapClick]);

  // Update markers when they change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));

    // Add new markers
    const newMarkers = markers.map(position => {
      return new window.google.maps.Marker({
        position,
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#0f766e',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
      });
    });

    setMapMarkers(newMarkers);
  }, [map, markers, mapMarkers]);

  // Update center when it changes
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  return <div ref={ref} className={className} />;
}

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div className="flex items-center space-x-2 text-gray-600">
        <Loader className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  );
}

function ErrorComponent({ status }: { status: Status }) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div className="text-center text-gray-600">
        <p className="text-sm font-medium">Map failed to load</p>
        <p className="text-xs mt-1">Status: {status}</p>
      </div>
    </div>
  );
}

export function GoogleMap(props: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`${props.className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center text-gray-600">
          <p className="text-sm font-medium">Google Maps API key required</p>
          <p className="text-xs mt-1">Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
        </div>
      </div>
    );
  }

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent status={status} />;
      case Status.SUCCESS:
        return <MapComponent {...props} />;
    }
  };

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
      libraries={['places']}
      version="weekly"
    />
  );
}