// import { QueryClient } from "@tanstack/react-query";
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { login, logout } from "../../Slices/authSlice";
// import {
//   ChevronDown,
//   Calendar,
//   User,
//   LogOut,
//   Compass,
//   Bell,
// } from "lucide-react";
// import useNotification from '../hooks/useNotification';
// const Header = () => {
//   const { notifications=[],handleNotificationAction , isMutating } = useNotification();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryClient = new QueryClient();
//   const { user } = useSelector((state) => state.auth);
//   const [currentTime, setCurrentTime] = useState(
//     new Date().toLocaleTimeString()
//   );
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => {
//     if (!user && localStorage.getItem("user")) {
//       const userString = localStorage.getItem("user");
//       if (userString) {
//         try {
//           const savedUser = JSON.parse(userString);
//           const savedToken = localStorage.getItem("token");
//           if (savedUser && savedToken) {
//             dispatch(login({ user: savedUser, token: savedToken }));
//           }
//         } catch (error) {
//           console.error("Error parsing user from localStorage:", error);
//           localStorage.removeItem("user");
//         }
//       }
//     }
//   }, [dispatch, user, location.pathname]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!user) return;

//       try {
//         const response = await fetch(
//           "http://localhost:8080/luma/notifications",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setNotifications(data.notifications);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     if (user) {
//       fetchNotifications();
//       const interval = setInterval(fetchNotifications, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [user, location.pathname]);

//   const handleCreateEvent = () => {
//     if (!user) {
//       navigate("/login", { state: { from: location.pathname } });
//     } else {
//       navigate("/event");
//     }
//     setIsProfileOpen(false);
//     setShowNotifications(false);
//   };

//   const handleDiscoverEvents = () => {
//     queryClient.invalidateQueries(['discover-events']);
//     navigate("/discover");
//   };
//   const handleLogout = () => {
//     navigate("/");
//     dispatch(logout());
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsProfileOpen(false);
//   };
//   const handleHome = () => {
//     queryClient.invalidateQueries(['events']);
//     navigate("/");
//   };

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50">
//     <div className="container mx-auto px-4 py-3">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-6">
//           <Link to="/" onClick={handleHome} className="flex items-center space-x-2 group">
//             <h1 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
//               Event Manager
//             </h1>
//           </Link>
//           <span className="text-lg text-gray-600 hidden md:inline-block font-medium">
//             {currentTime}
//           </span>
//         </div>

//         <div className="flex items-center space-x-3">
//           <Link to="/discover">
//           <button
//            onClick={handleDiscoverEvents}
//             className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//           >
//             <Compass className="w-5 h-5" />
//             <span className="hidden md:inline">Explore Events</span>
//           </button>
//           </Link>

//           <button
//             onClick={handleCreateEvent}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
//           >
//             <Calendar className="w-5 h-5" />
//             <span className="hidden md:inline">Create Event</span>
//           </button>

//           {user ? (
//             <div className="relative flex items-center">
//               <button
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
//               >
//                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                   <span className="text-sm font-medium text-blue-600">
//                     {(user?.name?.[0] || "U")}
//                   </span>
//                 </div>
//                 <span className="hidden md:inline font-medium text-gray-700">
//                   {user.name}
//                 </span>
//                 <ChevronDown className="w-4 h-4 text-gray-600" />
//               </button>

//               <div className="relative ml-2">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
//                 >
//                   <Bell className="w-5 h-5 text-gray-600" />
//                   {notifications.length > 0 && (
//                     <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
//                       {notifications.length}
//                     </span>
//                   )}
//                 </button>

//                 {showNotifications && notifications.length > 0 && (
//                   <div className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-100">
//                     <div className="p-4 max-h-96 overflow-y-auto">
//                       {notifications.map((notification) => (
//                         <div
//                           key={notification._id}
//                           className="mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                         >
//                           <p className="text-sm mb-2">
//                             <span className="font-medium">
//                               {notification.requester.name}
//                             </span>{" "}
//                             wants to join{" "}
//                             <span className="font-medium">
//                               {notification.event.name}
//                             </span>
//                           </p>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() =>
//                                 handleNotificationActi(notification._id, 'accept', notification.event._id)
//                               }
//                               className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex-1"
//                             >
//                               Accept
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleNotificationAction(notification._id, 'reject', notification.event._id)
//                               }
//                               className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex-1"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {isProfileOpen && (
//                 <div className="absolute top-12 right-20 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
//                   <div className="p-4">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                         <span className="text-lg font-medium text-blue-600">
//                           {(user?.name?.[0] || "U")}
//                         </span>
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-800">{user.name}</h3>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <Link
//                         to="/profile"
//                         className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
//                       >
//                         <User className="w-4 h-4" />
//                         <span>Profile</span>
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-red-600"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         <span>Sign Out</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
//             >
//               Log In
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   </header>
//   );
// };

// export default Header;
import { QueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../Slices/authSlice";
import {
  ChevronDown,
  Calendar,
  User,
  LogOut,
  LogIn,
  Compass,
  Bell,
} from "lucide-react";
import moment from 'moment';
import useNotification from "../hooks/useNotification";
import { FiLogIn } from "react-icons/fi";
const Header = () => {
  const { notifications, handleNotificationAction, isLoading } =
    useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = new QueryClient();
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(
    moment().format('hh:mm A [GMT]Z')
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user && localStorage.getItem("user")) {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const savedUser = JSON.parse(userString);
          const savedToken = localStorage.getItem("token");
          if (savedUser && savedToken) {
            dispatch(login({ user: savedUser, token: savedToken }));
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, [dispatch, user, location.pathname]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format('hh:mm A [GMT]Z'));
    },  1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCreateEvent = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    } else {
      navigate("/event");
    }
    setIsProfileOpen(false);
    setShowNotifications(false);
  };

  const handleDiscoverEvents = () => {
    queryClient.invalidateQueries(["discover-events"]);
    navigate("/discover");
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileOpen(false);
  };

  const handleHome = () => {
    queryClient.invalidateQueries(["events"]);
    navigate("/");
  };

  const handleNotificationClick = async (notificationId, action, eventId) => {
    await handleNotificationAction({ notificationId, action, eventId });
    setShowNotifications(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              onClick={handleHome}
              className="flex items-center space-x-2 group"
            >
              <h1 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Event Manager
              </h1>
            </Link>
            <span className="text-lg text-gray-600 hidden md:inline-block font-medium">
              {currentTime}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/discover">
              <button
                onClick={handleDiscoverEvents}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Compass className="w-5 h-5" />
                <span className="hidden md:inline">Explore Events</span>
              </button>
            </Link>

            <button
              onClick={handleCreateEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden md:inline">Create Event</span>
            </button>

            {user ? (
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user?.name?.[0] || "U"}
                    </span>
                  </div>
                  <span className="hidden md:inline font-medium text-gray-700">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                <div className="relative ml-2">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {showNotifications && notifications.length > 0 && (
                    <div className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-100">
                      <div className="p-4 max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className="mb-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <p className="text-sm mb-2">
                              <span className="font-medium">
                                {notification.requester.name}
                              </span>{" "}
                              wants to join{" "}
                              <span className="font-medium">
                                {notification.event.name}
                              </span>
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleNotificationClick(
                                    notification._id,
                                    "accept",
                                    notification.event._id
                                  )
                                }
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex-1"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleNotificationClick(
                                    notification._id,
                                    "reject",
                                    notification.event._id
                                  )
                                }
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex-1"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isProfileOpen && (
                  <div className="absolute top-12 right-20 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {user?.name?.[0] || "U"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden md:inline">Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
