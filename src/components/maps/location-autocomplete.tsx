'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string, place?: google.maps.places.PlaceResult) => void;
  className?: string;
  bias?: 'nigeria' | google.maps.LatLngBounds;
  disabled?: boolean;
}

export function LocationAutocomplete({
  placeholder = "Enter location",
  value = "",
  onChange,
  className,
  bias = 'nigeria',
  disabled = false,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places?.Autocomplete) {
      return;
    }

    // Configure autocomplete options
    const options: google.maps.places.AutocompleteOptions = {
      types: ['(cities)'],
      fields: ['place_id', 'name', 'formatted_address', 'geometry'],
    };

    // Set country bias
    if (bias === 'nigeria') {
      options.componentRestrictions = { country: 'ng' };
    } else if (bias instanceof google.maps.LatLngBounds) {
      options.bounds = bias;
    }

    // Create autocomplete instance
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current = autocomplete;

    // Handle place selection
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.formatted_address) {
        setInputValue(place.formatted_address);
        onChange?.(place.formatted_address, place);
      }
    });

    // Cleanup
    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, bias]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Call onChange for manual typing (without place data)
    onChange?.(newValue);
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className={`pl-9 ${className}`}
        disabled={disabled}
        autoComplete="off"
      />
    </div>
  );
}

// Hook for loading Google Maps Places API
export function useGoogleMapsPlaces() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google?.maps?.places?.Autocomplete) {
      setIsLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Create script element to load Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps API');
    };

    document.head.appendChild(script);

    return () => {
      // Note: We don't remove the script as it might be used by other components
    };
  }, []);

  return { isLoaded, error };
}