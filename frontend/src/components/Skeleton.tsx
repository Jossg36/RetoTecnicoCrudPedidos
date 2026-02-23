import React from 'react';
import '../styles/skeleton.css';

interface SkeletonProps {
  count?: number;
  circle?: boolean;
  height?: string;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 1, circle = false, height = '20px', width = '100%' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${circle ? 'skeleton-circle' : ''}`}
          style={{ height, width }}
        />
      ))}
    </>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-header">
      <Skeleton width="60%" height="24px" />
      <Skeleton width="100px" height="20px" circle />
    </div>
    <div className="skeleton-card-body">
      <Skeleton height="16px" />
      <Skeleton height="16px" width="80%" />
      <Skeleton height="16px" width="70%" />
    </div>
    <div className="skeleton-card-items">
      <Skeleton height="14px" width="90%" />
      <Skeleton height="14px" width="85%" />
    </div>
    <div className="skeleton-card-actions">
      <Skeleton width="60px" height="32px" />
      <Skeleton width="60px" height="32px" />
    </div>
  </div>
);

export { Skeleton, SkeletonCard };
