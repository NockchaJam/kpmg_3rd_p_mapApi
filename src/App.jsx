import { useState, useCallback } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import LocationInfo from './components/LocationInfo';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500);

  const handleLocationSelect = useCallback((locationInfo) => {
    setSelectedLocation(locationInfo);
  }, []);

  return (
    <div className="container">
      <Sidebar radius={radius} setRadius={setRadius} />
      {selectedLocation && (
        <LocationInfo 
          locationData={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
      <div className="map-container">
        <Map onLocationSelect={handleLocationSelect} radius={radius} />
      </div>
    </div>
  );
}

export default App; 