
import React from 'react';
import { Users, Car, Crown } from 'lucide-react';

interface RideType {
  id: string;
  name: string;
  description: string;
  price: string;
  eta: string;
  icon: React.ComponentType<{ className?: string }>;
  capacity: string;
}

interface RideTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (typeId: string) => void;
}

const rideTypes: RideType[] = [
  {
    id: 'uberx',
    name: 'UberX',
    description: 'Affordable rides for up to 4 people',
    price: '$12.50',
    eta: '3 min',
    icon: Car,
    capacity: '4'
  },
  {
    id: 'uberxl',
    name: 'UberXL',
    description: 'Larger rides for up to 6 people',
    price: '$18.75',
    eta: '5 min',
    icon: Users,
    capacity: '6'
  },
  {
    id: 'black',
    name: 'Uber Black',
    description: 'Premium rides with professional drivers',
    price: '$35.20',
    eta: '8 min',
    icon: Crown,
    capacity: '4'
  }
];

const RideTypeSelector: React.FC<RideTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="space-y-3">
      {rideTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              isSelected 
                ? 'border-black bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  isSelected ? 'bg-black' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <span className="text-sm text-gray-500">• {type.capacity} seats</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{type.eta} away</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{type.price}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RideTypeSelector;
