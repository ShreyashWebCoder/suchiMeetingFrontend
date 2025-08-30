
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Star, ChevronRight } from 'lucide-react';
import TripSummary from '../components/TripSummary';
import BottomSheet from '../components/BottomSheet';

const Activity = () => {
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);

  const trips = [
    {
      id: '1',
      pickup: '123 Main St, Manhattan',
      dropoff: 'Times Square, Manhattan',
      fare: '$12.50',
      duration: '15 min',
      distance: '3.2 mi',
      date: 'Today, 2:30 PM',
      driver: 'John Smith',
      status: 'completed',
      rating: 5
    },
    {
      id: '2',
      pickup: 'Central Park West',
      dropoff: '456 Business Ave, Manhattan',
      fare: '$8.75',
      duration: '12 min',
      distance: '2.1 mi',
      date: 'Yesterday, 9:15 AM',
      driver: 'Sarah Johnson',
      status: 'completed',
      rating: 4
    },
    {
      id: '3',
      pickup: 'Brooklyn Bridge',
      dropoff: '789 Home St, Brooklyn',
      fare: '$15.25',
      duration: '22 min',
      distance: '4.8 mi',
      date: 'Dec 8, 6:45 PM',
      driver: 'Mike Wilson',
      status: 'completed'
    },
    {
      id: '4',
      pickup: 'JFK Airport',
      dropoff: '123 Main St, Manhattan',
      fare: '$45.80',
      duration: '35 min',
      distance: '12.3 mi',
      date: 'Dec 7, 3:20 PM',
      driver: 'David Brown',
      status: 'completed',
      rating: 5
    }
  ];

  const handleTripClick = (trip: any) => {
    setSelectedTrip(trip);
    setShowTripDetails(true);
  };

  const handleRateTrip = (rating: number) => {
    if (selectedTrip) {
      // Update trip rating
      console.log(`Rated trip ${selectedTrip.id} with ${rating} stars`);
      setShowTripDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Your trips</h1>
        </div>
      </div>

      {/* Trip List */}
      <div className="p-4 space-y-4">
        {trips.map((trip) => (
          <button
            key={trip.id}
            onClick={() => handleTripClick(trip)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{trip.date}</span>
              <span className="text-lg font-bold text-gray-900">{trip.fare}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-100 rounded-full mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{trip.pickup}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-red-100 rounded-full mt-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{trip.dropoff}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{trip.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.distance}</span>
                </div>
                {trip.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{trip.rating}</span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>

      {/* Trip Details Bottom Sheet */}
      <BottomSheet
        isOpen={showTripDetails}
        onClose={() => setShowTripDetails(false)}
        height="lg"
      >
        {selectedTrip && (
          <TripSummary
            trip={selectedTrip}
            onRate={!selectedTrip.rating ? handleRateTrip : undefined}
          />
        )}
      </BottomSheet>
    </div>
  );
};

export default Activity;
