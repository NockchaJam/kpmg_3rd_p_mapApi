import { useState, useEffect } from 'react';

const Sidebar = ({ radius, setRadius, selectedLocation, onSearch }) => {
  const [inputRadius, setInputRadius] = useState(radius || '');

  const handleRadiusChange = (e) => {
    const newValue = e.target.value;
    setInputRadius(newValue);
  };

  const handleRadiusBlur = () => {
    const newRadius = Number(inputRadius);
    if (!isNaN(newRadius) && newRadius >= 0) {
      setRadius(newRadius);
    }
  };

  const handleRadiusKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleSearchClick = () => {
    onSearch();
  };

  return (
    <div className="sidebar">
      <div className="search-section">
        <h3>위치 검색</h3>
        <div className="search-steps">
          <div className="step">
            <div className="step-header">
              <span className="step-number">1</span>
              <span className="step-title">반경 설정</span>
            </div>
            <div className="step-content">
              <input 
                type="number" 
                value={inputRadius} 
                onChange={handleRadiusChange}
                onBlur={handleRadiusBlur}
                onKeyPress={handleRadiusKeyPress}
                style={{ width: '150px' }}
                min="0"
                placeholder="미터 단위로 입력"
              />
            </div>
          </div>

          <div className="step">
            <div className="step-header">
              <span className="step-number">2</span>
              <span className="step-title">위치 선택</span>
            </div>
            <div className="step-content">
              {selectedLocation ? (
                <>
                  <p><strong>주소:</strong> {selectedLocation.address}</p>
                  <p><strong>위도:</strong> {selectedLocation.coordinates.lat.toFixed(6)}</p>
                  <p><strong>경도:</strong> {selectedLocation.coordinates.lng.toFixed(6)}</p>
                </>
              ) : (
                <p className="help-text">지도에서 위치를 선택해주세요</p>
              )}
            </div>
          </div>
        </div>

        <button 
          className="search-button" 
          onClick={handleSearchClick}
          disabled={!selectedLocation}
        >
          검색하기
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 