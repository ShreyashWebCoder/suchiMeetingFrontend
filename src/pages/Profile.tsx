
import React, { useState } from 'react';
import { ArrowLeft, User, Star, CreditCard, Settings, HelpCircle, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import BottomSheet from '../components/BottomSheet';

const Profile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    rating: 4.9,
    totalTrips: 127,
    memberSince: 'January 2022'
  };

  const paymentMethods = [
    { id: '1', type: 'visa', last4: '4242', isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', isDefault: false },
    { id: '3', type: 'paypal', email: 'alex@email.com', isDefault: false }
  ];

  const menuItems = [
    { icon: CreditCard, label: 'Payment methods', action: () => setShowPaymentMethods(true) },
    { icon: Star, label: 'Rate the app', action: () => console.log('Rate app') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{user.rating}</span>
              <span className="text-sm text-gray-500">• {user.totalTrips} trips</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Member since {user.memberSince}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mx-4 mt-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
        
        {/* Sign Out */}
        <button className="w-full bg-white rounded-xl p-4 flex items-center space-x-3 shadow-sm border border-gray-200 hover:bg-red-50 transition-colors mt-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="font-medium text-red-600">Sign out</span>
        </button>
      </div>

      {/* Edit Profile Bottom Sheet */}
      <BottomSheet
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
        height="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue={user.phone}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
            Save Changes
          </button>
        </div>
      </BottomSheet>

      {/* Payment Methods Bottom Sheet */}
      <BottomSheet
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        title="Payment Methods"
        height="lg"
      >
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-xl border-2 ${
                method.isDefault ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-200">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {method.type === 'paypal' ? 'PayPal' : `•••• ${method.last4}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {method.type === 'paypal' ? method.email : method.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                {method.isDefault && (
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                    Default
                  </span>
                )}
              </div>
            </div>
          ))}
          
          <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 hover:bg-gray-50 transition-colors">
            + Add payment method
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Profile;
