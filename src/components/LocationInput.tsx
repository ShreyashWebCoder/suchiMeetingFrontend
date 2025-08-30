
import React, { useState } from 'react';
import { MapPin, Search, Clock, Star } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  suggestions = []
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const recentLocations = [
    { name: "Times Square", address: "Manhattan, NY", icon: Clock },
    { name: "Central Park", address: "Manhattan, NY", icon: Clock },
    { name: "Brooklyn Bridge", address: "Brooklyn, NY", icon: Clock }
  ];

  const savedLocations = [
    { name: "Home", address: "123 Main St, NY", icon: Star },
    { name: "Work", address: "456 Business Ave, NY", icon: Star }
  ];

  return (
    <div className="relative">
      <div className={`flex items-center bg-white rounded-lg border-2 transition-colors ${
        isFocused ? 'border-black' : 'border-gray-200'
      }`}>
        <div className="p-3">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="w-full outline-none text-gray-900 placeholder-gray-400"
          />
        </div>
        <div className="p-3">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 mt-2 z-50 max-h-80 overflow-y-auto">
          {/* Saved Locations */}
          {savedLocations.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Places</h3>
              {savedLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(location.address);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    <location.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.address}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Recent Locations */}
          {recentLocations.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent</h3>
              {recentLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(location.address);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    <location.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.address}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
