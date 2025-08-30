
import React from 'react';
import { Star, Phone, MessageCircle, Car } from 'lucide-react';

interface Driver {
  name: string;
  rating: number;
  photo: string;
  car: {
    model: string;
    color: string;
    licensePlate: string;
  };
  eta: string;
}

interface DriverInfoProps {
  driver: Driver;
  onCall: () => void;
  onMessage: () => void;
}

const DriverInfo: React.FC<DriverInfoProps> = ({ driver, onCall, onMessage }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={driver.photo}
              alt={driver.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{driver.rating}</span>
            </div>
            <p className="text-sm text-gray-600">{driver.eta} away</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onCall}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onMessage}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-lg">
            <Car className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{driver.car.color} {driver.car.model}</p>
            <p className="text-sm text-gray-600 font-mono">{driver.car.licensePlate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInfo;
