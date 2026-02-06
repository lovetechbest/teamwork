import React from 'react';
import './PageTitle.css';

const PageTitle = ({ icon: Icon, children }) => {
  return (
    <h2 className="page-title">
      {Icon && (
        <span className="title-icon">
          <Icon />
        </span>
      )}
      {children}
    </h2>
  );
};

export default PageTitle;
