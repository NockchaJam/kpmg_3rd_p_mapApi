import { useState } from 'react';

const Sidebar = ({ radius, setRadius, selectedType, setSelectedType, selectedLocation }) => {
  const [inputRadius, setInputRadius] = useState(radius || '');

  const handleApply = () => {
    const newRadius = Number(inputRadius);
    if (!isNaN(newRadius)) {
      setRadius(newRadius);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="sidebar">
      <div className="menu-item">
        <label>
          반경 설정 (미터):
          <input 
            type="number" 
            value={inputRadius} 
            onChange={(e) => setInputRadius(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ marginLeft: '10px', width: '100px' }}
            min="-1"
          />
        </label>
        <button onClick={handleApply} style={{ marginLeft: '10px' }}>적용</button>
      </div>
      <div className="menu-item">
        <label>
          업종 선택:
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ marginLeft: '10px', width: '150px' }}
          >
            <option value="restaurant">음식점</option>
            <option value="cafe">카페</option>
            <option value="convenience_store">편의점</option>
            <option value="pharmacy">약국</option>
            <option value="bank">은행</option>
          </select>
        </label>
      </div>
      {selectedLocation && (
        <div className="menu-item" style={{ display: 'block', marginTop: '20px' }}>
          <p><strong>주소:</strong> {selectedLocation.address}</p>
          <p><strong>위도:</strong> {selectedLocation.coordinates.lat.toFixed(6)}</p>
          <p><strong>경도:</strong> {selectedLocation.coordinates.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 