import { useState, useCallback, useRef } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import VacantList from './components/VacantList';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const searchRef = useRef(null);
  const mapRef = useRef(null);

  const handleLocationSelect = useCallback((locationInfo) => {
    setSelectedLocation(locationInfo);
    if (locationInfo?.searchResults) {
      setSearchResults(locationInfo.searchResults);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchRef.current) {
      searchRef.current();
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

  return (
    <div className="container">
      <Sidebar 
        radius={radius} 
        setRadius={setRadius} 
        selectedLocation={selectedLocation}
        onSearch={handleSearch}
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
      <VacantList 
        searchResults={searchResults} 
        highlightedLocation={highlightedLocation}
        onItemClick={handleListItemClick}
      />
    </div>
  );
}

export default App; 