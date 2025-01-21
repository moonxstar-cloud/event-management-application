import { ShieldAlert, RefreshCcw, LogIn, Contact } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForbiddenError = ({ onRetry, errorDetails }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
  };

  const handleSupport = () => {
    navigate('/contact-support');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <ShieldAlert className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          You don't have permission to access this resource. This might be due to:
        </p>

        <ul className="space-y-2 text-gray-600 mb-6">
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 flex-shrink-0">•</span>
            <span>Insufficient permissions or authentication required</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 flex-shrink-0">•</span>
            <span>IP address restrictions or firewall rules</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 flex-shrink-0">•</span>
            <span>Resource has been moved or deleted</span>
          </li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </button>

          <button
            onClick={handleSupport}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Contact className="w-4 h-4" />
            Contact Support
          </button>
        </div>

        {errorDetails && (
          <div className="mt-6">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
            </button>
            
            {showTechnicalDetails && (
              <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 overflow-x-auto">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForbiddenError;