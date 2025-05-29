"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

interface PostcodeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface GeolocationResponse {
  postcode?: string;
  error?: string;
}

export default function PostcodeInput({
  id,
  value,
  onChange,
  placeholder = "e.g., SW1A 1AA",
  className = "",
  disabled = false
}: PostcodeInputProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log(`📍 Location detected: ${latitude}, ${longitude}`);

      // Reverse geocode to get postcode
      const postcode = await reverseGeocode(latitude, longitude);

      if (postcode) {
        onChange(postcode);
        console.log(`✅ Postcode detected: ${postcode}`);
      } else {
        throw new Error('Could not determine postcode from location');
      }

    } catch (error) {
      console.error('Location detection error:', error);

      let errorMessage = 'Could not detect location';

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setLocationError(errorMessage);

      // Clear error after 5 seconds
      setTimeout(() => setLocationError(null), 5000);
    } finally {
      setIsDetecting(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      // Try multiple geocoding services for better coverage

      // First try: UK Government Data
      const ukGovResponse = await fetch(
        `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1`
      );

      if (ukGovResponse.ok) {
        const ukGovData = await ukGovResponse.json();
        if (ukGovData.result && ukGovData.result.length > 0) {
          return ukGovData.result[0].postcode;
        }
      }

      // Fallback: Nominatim (OpenStreetMap)
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'WorryFreeCarFinder/1.0'
          }
        }
      );

      if (nominatimResponse.ok) {
        const nominatimData = await nominatimResponse.json();
        if (nominatimData.address && nominatimData.address.postcode) {
          return nominatimData.address.postcode;
        }
      }

      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className={className}
          disabled={disabled || isDetecting}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={disabled || isDetecting}
          className="shrink-0 hidden sm:flex items-center gap-2"
          title="Detect my location"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden md:inline">Detecting...</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Use My Location</span>
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={disabled || isDetecting}
          className="shrink-0 flex sm:hidden"
          title="Detect my location"
        >
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {locationError && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
          {locationError}
        </div>
      )}

      {isDetecting && (
        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-2 py-1">
          📍 Detecting your location...
        </div>
      )}
    </div>
  );
}
