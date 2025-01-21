import React from 'react';

const Alert = ({ children }) => {
  return (
    <div className="alert">
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => {
  return (
    <p className="alert-description">
      {children}
    </p>
  );
};
const AlertTitle = ({ children }) => {
  return (
    <p className="alert-title">
      {children}
    </p>
  );
};


export { Alert, AlertDescription,AlertTitle };