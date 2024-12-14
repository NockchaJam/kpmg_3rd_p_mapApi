import React, { useState } from 'react';
import VacantList from './VacantList';
import BusinessList from './BusinessList';
import './VacantList.css';

const TabContainer = ({ searchResults, businesses, locationScores, highlightedLocation, onItemClick }) => {
  const [activeTab, setActiveTab] = useState('vacant');

  return (
    <div className="tab-container">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'vacant' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacant')}
        >
          공실 목록
        </div>
        <div 
          className={`tab ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          상가 목록
        </div>
      </div>
      <div className="tab-content">
        {activeTab === 'vacant' ? (
          <VacantList 
            searchResults={searchResults}
            highlightedLocation={highlightedLocation}
            onItemClick={onItemClick}
            locationScores={locationScores}
          />
        ) : (
          <BusinessList businesses={businesses} />
        )}
      </div>
    </div>
  );
};

export default TabContainer; 