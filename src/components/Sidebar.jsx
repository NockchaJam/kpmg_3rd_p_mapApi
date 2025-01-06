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
  const [inputBusinessRadius, setInputBusinessRadius] = useState('');
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
      inputBusinessRadius
    });
  }, [isSearchCompleted, selectedBusinessType, inputBusinessRadius]);

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

  const handleBusinessRadiusChange = (e) => {
    const newValue = e.target.value;
    setInputBusinessRadius(newValue);
  };

  const handleBusinessSearch = () => {
    const radius = Number(inputBusinessRadius);
    if (selectedBusinessType && !isNaN(radius) && radius > 0) {
      onBusinessSearch(selectedBusinessType, radius);
    }
  };

  return (
    <div className="sidebar">
      <div className="search-section">
        <h3>공실 검색</h3>
        <div className="search-steps">
          <div className="step">
            <div className="step-header">
              <span className="step-number">1</span>
              <span className="step-title">반경 설정</span>
            </div>
            <div className="step-content">
              <div className="search-box" style={{ 
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '5px',
                background: 'white'
              }}>
                <input 
                  type="number" 
                  value={inputRadius} 
                  onChange={handleRadiusChange}
                  onBlur={handleRadiusBlur}
                  onKeyPress={handleRadiusKeyPress}
                  style={{ 
                    width: '90px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    padding: '0 10px'
                  }}
                  min="0"
                  placeholder="반경(m)"
                />
              </div>
            </div>
          </div>

          <div className="step">
            <div className="step-header">
              <span className="step-number">2</span>
              <span className="step-title">위치 선택</span>
            </div>
            <div className="step-content">
              {selectedLocation ? (
                <p><strong>주소:</strong> {selectedLocation.address}</p>
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

      <div className="business-search-section">
        <h3>주변 상가 검색</h3>
        <div className="step-content">
          <select 
            value={selectedBusinessType}
            onChange={(e) => setSelectedBusinessType(e.target.value)}
            style={{ 
              width: '100%',
              marginBottom: '10px',
              height: '36px',
              padding: '0 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              outline: 'none',
              fontSize: '14px'
            }}
          >
            <option value="">업종 선택</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="search-box" style={{ 
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '5px',
            background: 'white',
            marginBottom: '10px'
          }}>
            <input 
              type="number" 
              value={inputBusinessRadius}
              onChange={handleBusinessRadiusChange}
              style={{ 
                width: '90px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                padding: '0 10px'
              }}
              min="0"
              placeholder="반경(m)"
            />
          </div>
          <button 
            className="search-button"
            onClick={handleBusinessSearch}
            disabled={!isSearchCompleted || !selectedBusinessType || !inputBusinessRadius || !selectedLocation}
            style={{
              height: '36px',
              padding: '0 15px',
              borderRadius: '4px',
              backgroundColor: (!isSearchCompleted || !selectedBusinessType || !inputBusinessRadius || !selectedLocation) ? '#ccc' : '#4285F4',
              color: 'white',
              border: 'none',
              cursor: (!isSearchCompleted || !selectedBusinessType || !inputBusinessRadius || !selectedLocation) ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            주변 상가 검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 