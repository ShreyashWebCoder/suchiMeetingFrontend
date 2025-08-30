import React, { useState } from "react";
import { Menu, User, Clock, MapPin } from "lucide-react";
import MapView from "../components/MapView";
import LocationInput from "../components/LocationInput";
import RideTypeSelector from "../components/RideTypeSelector";
import BottomSheet from "../components/BottomSheet";
import DriverInfo from "../components/DriverInfo";

const Home = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [selectedRideType, setSelectedRideType] = useState("uberx");
  const [showRideOptions, setShowRideOptions] = useState(false);
  const [rideStatus, setRideStatus] = useState<
    "booking" | "searching" | "matched" | "enroute" | "arrived"
  >("booking");

  const mockDriver = {
    name: "John Smith",
    rating: 4.9,
    photo: "/placeholder.svg",
    car: {
      model: "Toyota Camry",
      color: "Silver",
      licensePlate: "ABC-1234",
    },
    eta: "3 min",
  };

  const handleBookRide = () => {
    if (pickupLocation && dropoffLocation) {
      setShowRideOptions(true);
    }
  };

  const handleConfirmRide = () => {
    setRideStatus("searching");
    setShowRideOptions(false);

    // Simulate finding a driver
    setTimeout(() => {
      setRideStatus("matched");
    }, 3000);
  };

  const recentTrips = [
    { location: "Times Square, Manhattan", time: "2 hours ago" },
    { location: "Central Park West", time: "Yesterday" },
    { location: "Brooklyn Bridge", time: "2 days ago" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Uber</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          isRideActive={rideStatus === "matched" || rideStatus === "enroute"}
          driverLocation={
            rideStatus === "matched"
              ? { lat: 40.7128, lng: -74.006 }
              : undefined
          }
        />

        {/* Location Input Card */}
        {rideStatus === "booking" && (
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Where to?
              </h2>

              <div className="space-y-4">
                <LocationInput
                  label="Pickup Location"
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                />

                <LocationInput
                  label="Dropoff Location"
                  placeholder="Where are you going?"
                  value={dropoffLocation}
                  onChange={setDropoffLocation}
                />
              </div>

              {/* Recent Trips */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Recent trips
                </h3>
                <div className="space-y-2">
                  {recentTrips.map((trip, index) => (
                    <button
                      key={index}
                      onClick={() => setDropoffLocation(trip.location)}
                      className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="p-2 bg-gray-100 rounded-full mr-3">
                        <Clock className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">
                          {trip.location}
                        </p>
                        <p className="text-sm text-gray-500">{trip.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBookRide}
                disabled={!pickupLocation || !dropoffLocation}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                See prices
              </button>
            </div>
          </div>
        )}

        {/* Searching for Driver */}
        {rideStatus === "searching" && (
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-black rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Looking for a driver...
              </h3>
              <p className="text-gray-600">This usually takes 1-2 minutes</p>
              <button
                onClick={() => setRideStatus("booking")}
                className="w-full mt-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Driver Matched */}
        {rideStatus === "matched" && (
          <div className="absolute bottom-6 left-4 right-4">
            <DriverInfo
              driver={mockDriver}
              onCall={() => console.log("Calling driver")}
              onMessage={() => console.log("Messaging driver")}
            />
            <button
              onClick={() => setRideStatus("booking")}
              className="w-full mt-4 py-3 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors"
            >
              Cancel ride
            </button>
          </div>
        )}
      </div>

      {/* Ride Options Bottom Sheet */}
      <BottomSheet
        isOpen={showRideOptions}
        onClose={() => setShowRideOptions(false)}
        title="Choose a ride"
        height="lg"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-full">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium text-gray-900">{pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium text-gray-900">{dropoffLocation}</p>
              </div>
            </div>
          </div>

          <RideTypeSelector
            selectedType={selectedRideType}
            onTypeSelect={setSelectedRideType}
          />

          <button
            onClick={handleConfirmRide}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Confirm{" "}
            {selectedRideType === "uberx"
              ? "UberX"
              : selectedRideType === "uberxl"
                ? "UberXL"
                : "Uber Black"}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Home;
