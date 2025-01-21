import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleCreateEvent = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      navigate('/event');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left max-w-xl">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
                Delightful events{' '}
                <span className="block">
                  <span className="text-blue-600">start</span>{' '}
                  <span className="text-pink-500">here.</span>
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Set up an event page, invite friends and sell tickets. Host a memorable event today.
              </p>
              <button
                onClick={handleCreateEvent}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Create Your First Event
              </button>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-pink-200 rounded-full blur-3xl opacity-30 "></div>
                <img
                  src={"https://img.freepik.com/free-vector/confirmed-attendance-concept-illustration_114360-7615.jpg"}
                  alt="Event App Preview"
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform rotate-3"
                />
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-100"></div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
              <p className="text-gray-600">Create your event page in minutes with our intuitive tools.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Invite & Share</h3>
              <p className="text-gray-600">Share your event with friends and family across all platforms.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Track & Manage</h3>
              <p className="text-gray-600">Monitor RSVPs and manage your event details all in one place.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Return the original events list view for logged-in users
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Your existing events list code here */}
      </main>
    </div>
  );
};

export default Main;