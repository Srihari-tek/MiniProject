import React from 'react';
import { useLocation } from 'react-router-dom';
import RecommendationDisplay from './RecommendationDisplay';

const RecommendationWrapper = () => {
  const location = useLocation();
  const userId = location.state?.userId || 'guest';

  return <RecommendationDisplay userId={userId} />;
};

export default RecommendationWrapper;
