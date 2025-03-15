// src/components/stores/overview/StoreOverview.jsx
import React from 'react';
import StoreBasicInfo from '../StoreBasicInfo';
import StoreTimeline from '../StoreTimeline';

const StoreOverview = ({ store }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <StoreBasicInfo store={store} />
      </div>
      <div>
        <StoreTimeline store={store} />
      </div>
    </div>
  );
};

export default StoreOverview;