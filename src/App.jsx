import { useState, useCallback } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import LocationInfo from './components/LocationInfo';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [selectedType, setSelectedType] = useState('restaurant');

  const handleLocationSelect = useCallback((locationInfo) => {
    setSelectedLocation(locationInfo);
  }, []);

  return (
    <div className="container">
      <Sidebar 
        radius={radius} 
        setRadius={setRadius} 
        selectedType={selectedType} 
        setSelectedType={setSelectedType}
        selectedLocation={selectedLocation}
      />
      {selectedLocation && (
        <LocationInfo 
          locationData={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
      <div className="map-container">
        <Map 
          onLocationSelect={handleLocationSelect} 
          radius={radius} 
          selectedType={selectedType}
        />
      </div>
    </div>
  );
}

export default App; 