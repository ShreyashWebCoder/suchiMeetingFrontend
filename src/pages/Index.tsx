
import React, { useState } from 'react';
import Home from './Home';
import Activity from './Activity';
import Profile from './Profile';
import NavigationBar from '../components/NavigationBar';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'activity':
        return <Activity />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
