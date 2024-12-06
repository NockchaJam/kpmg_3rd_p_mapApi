import React, { useEffect, useRef } from 'react';
import './VacantList.css';

const VacantList = ({ searchResults, highlightedLocation, onItemClick }) => {
  const listRef = useRef(null);
  const groupRefs = useRef({});

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 검색 결과를 위치별로 그룹화
  const groupedResults = searchResults.reduce((acc, result) => {
    const key = `${result.latitude},${result.longitude}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {});

  // highlightedLocation이 변경될 때 해당 요소로 스크롤
  useEffect(() => {
    if (highlightedLocation && groupRefs.current[highlightedLocation]) {
      const element = groupRefs.current[highlightedLocation];
      const container = listRef.current;
      
      if (element && container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // 요소가 컨테이너의 뷰포트를 벗어났는지 확인
        if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [highlightedLocation]);

  return (
    <div className="vacant-list-container" ref={listRef}>
      <div className="vacant-list-header">
        <h3>공실 목록 ({searchResults.length}개)</h3>
      </div>
      <div className="vacant-list">
        {Object.entries(groupedResults).map(([locationKey, locations]) => {
          const [lat, lng] = locationKey.split(',').map(Number);
          return (
            <div 
              key={locationKey} 
              ref={el => groupRefs.current[locationKey] = el}
              className={`vacant-group ${highlightedLocation === locationKey ? 'highlighted' : ''}`}
              onClick={() => onItemClick(lat, lng)}
            >
              {locations.map((result, index) => (
                <div key={index} className="vacant-item">
                  <div className="vacant-item-header">
                    <span className="property-type">{result.property_type}</span>
                    <span className="floor-info">{result.floor_info}</span>
                  </div>
                  <div className="vacant-item-price">
                    <div className="price-row">
                      <span className="price-label">보증금</span>
                      <span className="price-value">{formatPrice(result.deposit)}만원</span>
                    </div>
                    <div className="price-row">
                      <span className="price-label">월세</span>
                      <span className="price-value">{formatPrice(result.monthly_rent)}만원</span>
                    </div>
                  </div>
                  <div className="vacant-item-details">
                    <div className="detail-row">
                      <span className="detail-label">면적</span>
                      <span className="detail-value">{result.area1}㎡ ({Math.floor(result.area1 * 0.3025)}평)</span>
                    </div>
                    {result.description && (
                      <div className="description">
                        {result.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VacantList; 