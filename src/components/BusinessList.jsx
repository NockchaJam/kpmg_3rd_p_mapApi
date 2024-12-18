import React from 'react';
import './BusinessList.css';

const BusinessList = ({ businesses }) => {
  return (
    <div className="business-list">
      <div className="business-count">
        검색된 상가: {businesses.length}개
      </div>
      
      {businesses.map((business, index) => (
        <div key={index} className="business-item">
          <div className="business-header">
            <span className="business-type">{business.industry_category || '업종 미상'}</span>
            <span className={`business-score score-${business.sales_level === '상' ? '4' : 
                                                   business.sales_level === '중' ? '2' : '0'}`}>
              매출등급: {business.sales_level || '미상'}
            </span>
          </div>
          <div className="business-content">
            <div className="business-distance">
              <span className="label">거리:</span>
              <span className="value">{Math.round(business.distance)}m</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusinessList; 