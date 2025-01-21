
import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import useNotification from '../hooks/useNotification';

const NotificationDropdown = () => {
  const { notifications, handleNotificationAction } = useNotification();

  if (!notifications?.length) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </h3>
      </div>
      <div className="divide-y">
        {notifications.map((notification) => (
          <div key={notification._id} className="p-4 hover:bg-gray-50">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">
                Event Join Request
              </AlertTitle>
              <AlertDescription className="text-blue-700 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">
                      {notification.requester.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{notification.requester.name}</p>
                    <p className="text-sm">{notification.requester.email}</p>
                  </div>
                </div>
                <p className="mb-4">
                  wants to join your event "{notification.event.name}"
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNotificationAction(notification._id, "accept", notification.event._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleNotificationAction(notification._id, "reject", notification.event._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;