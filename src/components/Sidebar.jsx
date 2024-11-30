import { useState, useEffect } from 'react';

const Sidebar = ({ radius, setRadius, selectedType, setSelectedType, selectedLocation, onSearch }) => {
  const [inputRadius, setInputRadius] = useState(radius || '');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (selectedLocation?.searchResults) {
      setSearchResults(selectedLocation.searchResults);
    } else {
      setSearchResults([]);
    }
  }, [selectedLocation]);

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
              <span className="step-title">업종 선택</span>
            </div>
            <div className="step-content">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="음식점">음식점</option>
                <option value="카페">카페</option>
                <option value="편의점">편의점</option>
                <option value="약국">약국</option>
                <option value="은행">은행</option>
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

      <div className="search-results">
        <div className="search-results-header">
          <h3>검색 결과</h3>
        </div>
        <div className="search-results-list">
          {searchResults.map((result, index) => (
            <div key={index} className="search-result-item">
              <p>{result.name}</p>
              <p>{result.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 