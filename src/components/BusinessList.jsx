import React from 'react';
import './BusinessList.css';

const BusinessList = ({ businesses }) => {
  return (
    <div className="business-list">
      {businesses.map((business, index) => (
        <div key={index} className="business-item">
          <div className="business-header">
            <span className="business-name">{business.building_name || '이름 없음'}</span>
            <span className={`business-score score-${Math.floor(business.score/20)}`}>
              점수: {business.score}
            </span>
          </div>
          <div className="business-content">
            <div className="business-type">
              <span className="label">업종:</span>
              <span className="value">{business.business_type}</span>
            </div>
            <div className="business-address">
              <span className="label">주소:</span>
              <span className="value">{business.address}</span>
            </div>
            {business.floor_info && (
              <div className="business-floor">
                <span className="label">층:</span>
                <span className="value">{business.floor_info}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessList; 