import { useState, useCallback, useRef } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import TabContainer from './components/TabContainer';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const searchRef = useRef(null);
  const mapRef = useRef(null);
  const [isSearchCompleted, setIsSearchCompleted] = useState(false);
  const [businessSearchResults, setBusinessSearchResults] = useState({
    scores: {},
    businesses: []
  });

  const handleLocationSelect = useCallback((locationInfo) => {
    setSelectedLocation(locationInfo);
    console.log('Location selected');
    if (locationInfo?.searchResults) {
      setSearchResults(locationInfo.searchResults);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchRef.current) {
      searchRef.current();
      setIsSearchCompleted(true);
      console.log('Search completed, isSearchCompleted set to true');
    }
  }, []);

  const handleMarkerClick = useCallback((lat, lng) => {
    setHighlightedLocation(`${lat},${lng}`);
  }, []);

  const handleListItemClick = useCallback((lat, lng) => {
    setHighlightedLocation(`${lat},${lng}`);
    if (mapRef.current?.showInfoWindow) {
      mapRef.current.showInfoWindow(lat, lng);
    }
  }, []);

  const handleBusinessSearch = useCallback(async (businessType, searchRadius) => {
    if (mapRef.current?.searchBusinesses) {
      const { businesses, locationScores } = await mapRef.current.searchBusinesses(businessType, searchRadius);
      setBusinessSearchResults({
        scores: locationScores,
        businesses: businesses
      });
    }
  }, []);

  return (
    <div className="container">
      <Sidebar 
        radius={radius} 
        setRadius={setRadius} 
        selectedLocation={selectedLocation}
        onSearch={handleSearch}
        onBusinessSearch={handleBusinessSearch}
        isSearchCompleted={isSearchCompleted}
      />
      <div className="map-container">
        <Map 
          ref={mapRef}
          onLocationSelect={handleLocationSelect} 
          radius={radius} 
          onSearch={searchRef}
          onMarkerClick={handleMarkerClick}
        />
      </div>
      <TabContainer 
        searchResults={searchResults}
        businesses={businessSearchResults.businesses}
        locationScores={businessSearchResults.scores}
        highlightedLocation={highlightedLocation}
        onItemClick={handleListItemClick}
      />
    </div>
  );
}

export default App; 