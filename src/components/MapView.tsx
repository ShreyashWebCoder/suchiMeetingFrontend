
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car } from 'lucide-react';

interface MapViewProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  driverLocation?: { lat: number; lng: number };
  isRideActive?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  pickupLocation, 
  dropoffLocation, 
  driverLocation, 
  isRideActive = false 
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-grid-pattern"></div>
      </div>
      
      {/* Map Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30"></div>
      
      {/* Location Markers */}
      {pickupLocation && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
          <div className="bg-green-500 p-3 rounded-full shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="bg-white px-3 py-1 rounded-lg shadow-md mt-2 text-sm font-medium text-center">
            Pickup
          </div>
        </div>
      )}
      
      {dropoffLocation && (
        <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-red-500 p-3 rounded-full shadow-lg animate-pulse">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="bg-white px-3 py-1 rounded-lg shadow-md mt-2 text-sm font-medium text-center">
            Dropoff
          </div>
        </div>
      )}
      
      {/* Driver Location */}
      {isRideActive && driverLocation && (
        <div className="absolute bottom-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <div className="bg-black p-3 rounded-full shadow-lg">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div className="bg-white px-3 py-1 rounded-lg shadow-md mt-2 text-sm font-medium text-center">
            Your Driver
          </div>
        </div>
      )}
      
      {/* Current Location Button */}
      <button className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <Navigation className="w-6 h-6 text-gray-600" />
      </button>
      
      {/* Route Line (when ride is active) */}
      {isRideActive && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 20% 60% Q 50% 30% 70% 45%"
            stroke="#000000"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,5"
            className="animate-pulse"
          />
        </svg>
      )}
    </div>
  );
};

export default MapView;
