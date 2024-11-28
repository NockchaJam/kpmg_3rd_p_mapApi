import { useState, useEffect } from 'react';

const Sidebar = ({ radius, setRadius, selectedType, setSelectedType, selectedLocation, onSearch }) => {
  const [inputRadius, setInputRadius] = useState(radius || '');
  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    // 최근 위치 데이터 가져오기
    const fetchRecentLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/locations/recent');
        const data = await response.json();
        setRecentLocations(data);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      }
    };

    fetchRecentLocations();
  }, []);

  const handleRadiusChange = (e) => {
    const newValue = e.target.value;
    setInputRadius(newValue);
    const newRadius = Number(newValue);
    if (!isNaN(newRadius)) {
      setRadius(newRadius);
    }
  };

  const handleSearchClick = () => {
    onSearch();  // 검색 실행
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
                style={{ width: '150px' }}
                min="-1"
                placeholder="미터 단위로 입력"
              />
            </div>
          </div>

          <div className="step">
            <div className="step-header">
              <span className="step-number">2</span>
              <span className="step-title">업종 선택</span>
            </div>
            <div className="step-content">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="restaurant">음식점</option>
                <option value="cafe">카페</option>
                <option value="convenience_store">편의점</option>
                <option value="pharmacy">약국</option>
                <option value="bank">은행</option>
              </select>
            </div>
          </div>

          <div className="step">
            <div className="step-header">
              <span className="step-number">3</span>
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

      <div className="recent-locations">
        <h3>최근 등록된 위치</h3>
        <ul className="location-list">
          {recentLocations.map((location) => (
            <li key={location.id} className="location-item">
              <h4>{location.name}</h4>
              <p>{location.address}</p>
              <p>업종: {location.industry}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 