
import React from 'react';
import { MapPin, Clock, CreditCard, Star } from 'lucide-react';

interface Trip {
  id: string;
  pickup: string;
  dropoff: string;
  fare: string;
  duration: string;
  distance: string;
  date: string;
  driver: string;
  rating?: number;
}

interface TripSummaryProps {
  trip: Trip;
  onRate?: (rating: number) => void;
}

const TripSummary: React.FC<TripSummaryProps> = ({ trip, onRate }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Trip Summary</h3>
        <span className="text-2xl font-bold text-green-600">{trip.fare}</span>
      </div>
      
      {/* Route */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-full mt-1">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-medium text-gray-900">{trip.pickup}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-100 rounded-full mt-1">
            <MapPin className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Dropoff</p>
            <p className="font-medium text-gray-900">{trip.dropoff}</p>
          </div>
        </div>
      </div>
      
      {/* Trip Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="p-3 bg-gray-100 rounded-xl mb-2">
            <Clock className="w-5 h-5 text-gray-600 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Duration</p>
          <p className="font-semibold text-gray-900">{trip.duration}</p>
        </div>
        
        <div className="text-center">
          <div className="p-3 bg-gray-100 rounded-xl mb-2">
            <MapPin className="w-5 h-5 text-gray-600 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Distance</p>
          <p className="font-semibold text-gray-900">{trip.distance}</p>
        </div>
        
        <div className="text-center">
          <div className="p-3 bg-gray-100 rounded-xl mb-2">
            <CreditCard className="w-5 h-5 text-gray-600 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Payment</p>
          <p className="font-semibold text-gray-900">Card</p>
        </div>
      </div>
      
      {/* Driver Rating */}
      {onRate && !trip.rating && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Rate your driver</h4>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onRate(rating)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {trip.rating && (
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600 mb-2">You rated {trip.driver}</p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= trip.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSummary;
