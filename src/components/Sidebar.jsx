import { useState, useEffect } from 'react';

const Sidebar = ({ 
  radius, 
  setRadius, 
  selectedLocation, 
  onSearch, 
  onBusinessSearch,
  isSearchCompleted 
}) => {
  const [inputRadius, setInputRadius] = useState(radius || '');
  const [businessRadius, setBusinessRadius] = useState(100);
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [businessTypes, setBusinessTypes] = useState([]);
  
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/business-categories');
        if (!response.ok) throw new Error('업종 목록 가져오기 실패');
        const categories = await response.json();
        setBusinessTypes(categories);
        console.log('업종 목록 로드됨:', categories);
      } catch (error) {
        console.error('업종 목록 로드 중 오류:', error);
      }
    };

    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    console.log('Current states:', {
      isSearchCompleted,
      selectedBusinessType,
      businessRadius
    });
  }, [isSearchCompleted, selectedBusinessType, businessRadius]);

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

  const handleBusinessSearch = () => {
    console.log('Business search clicked:', {
      selectedBusinessType,
      businessRadius
    });
    if (selectedBusinessType) {
      onBusinessSearch(selectedBusinessType, businessRadius);
    }
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

          <button 
            className="search-button" 
            onClick={handleSearchClick}
            disabled={!selectedLocation}
          >
            검색하기
          </button>
        </div>
      </div>

      <div className={`business-search-section ${!isSearchCompleted ? 'disabled' : ''}`}>
        <h3>주변 상가 검색</h3>
        <div className="step-content">
          <select 
            value={selectedBusinessType}
            onChange={(e) => {
              console.log('Business type selected:', e.target.value);
              setSelectedBusinessType(e.target.value);
            }}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="">업종 선택</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={businessRadius}
            onChange={(e) => setBusinessRadius(Number(e.target.value))}
            style={{ width: '100%', marginBottom: '10px' }}
            min="0"
            placeholder="반경(미터) 입력"
          />
          <button 
            className="search-button"
            onClick={handleBusinessSearch}
            disabled={!isSearchCompleted || !selectedBusinessType}
          >
            주변 상가 검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 