import { useState, useCallback, useRef } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [selectedType, setSelectedType] = useState('restaurant');
  const searchRef = useRef(null);

  const handleLocationSelect = useCallback((locationInfo) => {
    setSelectedLocation(locationInfo);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchRef.current) {
      searchRef.current();
    }
  }, []);

  return (
    <div className="container">
      <Sidebar 
        radius={radius} 
        setRadius={setRadius} 
        selectedType={selectedType} 
        setSelectedType={setSelectedType}
        selectedLocation={selectedLocation}
        onSearch={handleSearch}
      />
      <div className="map-container">
        <Map 
          onLocationSelect={handleLocationSelect} 
          radius={radius} 
          selectedType={selectedType}
          onSearch={searchRef}
        />
      </div>
    </div>
  );
}

export default App; 