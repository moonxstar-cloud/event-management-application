// import { useState } from 'react';
// import { toast } from 'react-toastify';
// import axios from '../utils/axios';
// const useNotification = () => {
//   const [notifications, setNotifications] = useState([]);
  
//   const handleNotificationAction = async (notificationId, action, eventId) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:8080/luma/notifications/${notificationId}`,
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ action: action.toLowerCase() }),
//         }
//       );

//       if (response.ok) {
//         // Remove the notification from the list
//         setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        
//         if (action === 'accept') {
//           toast.success('Guest approved!');
          
//           // Update the event's attendees list
//           await fetch(`http://localhost:8080/luma/events/${eventId}/attendees`, {
//             method: 'PUT',
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 
//               notificationId,
//               status: 'accepted' 
//             }),
//           });
//         } else {
//           toast.info('Guest rejected');
//         }
//       }
//     } catch (error) {
//       console.error(`Error ${action}ing notification:`, error);
//       toast.error(`Failed to ${action} guest`);
//     }
//   };

//   return {
//     notifications,
//     setNotifications,
//     handleNotificationAction,
//   };
// };

// export default useNotification;
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from '../utils/axios';

// const useNotification = () => {
//   const queryClient = useQueryClient();

//   const { data: notifications=[], error, isLoading } = useQuery({
//     queryKey: ['notifications'],
//     queryFn: async () => {
//       console.log('Fetching notifications...');
//       const response = await axios.get('http://localhost:8080/luma/notifications');
//       return response.data.notifications;
//     },
//     refetchInterval: 30000,
//   })
//   console.log('Notifications:', notifications);
//   const { mutate: handleNotificationAction, isLoading: isMutating } = useMutation({
//     mutationFn: async ({ notificationId, action, eventId }) => {
//       console.log('Handling notification action...');
//       const response = await axios.post(
//         `http://localhost:8080/luma/notifications/${notificationId}`,
//         {
//           action: action.toLowerCase(),
//         }
//       );
//       console.log('Notification action handled:', response.data);
//       return response.data;
//     },
//     onSuccess: (data, { notificationId }) => {
//       console.log('Notification action successful...');
//       // Remove the notification from the list
//       queryClient.setQueryData(['notifications'], (oldNotifications) =>
//         oldNotifications.filter((n) => n._id !== notificationId)
//       );
  
//       if (data.action === 'accept') {
//         // Update the event's attendees list
//         axios.put(`http://localhost:8080/luma/events/${data.eventId}/attendees`, {
//           notificationId,
//           status: 'accepted',
//         });
//       }
//     },
//     onError: (error) => {
//       console.error('Error handling notification:', error);
//     },
//   });

//   return {
//     notifications,
//     error,
//     isLoading,
//     handleNotificationAction,
//     isMutating,
//   };
// };

// export default useNotification;
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const useNotification = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], error, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8080/luma/notifications');
      return response.data.notifications;
    },
    refetchInterval: 30000,
  });

  const { mutate: handleNotificationAction, isLoading: isMutating } = useMutation({
    mutationFn: async ({ notificationId, action, eventId }) => {
      const response = await axios.post(
        `http://localhost:8080/luma/notifications/${notificationId}`,
        {
          action: action.toLowerCase(),
        }
      );

      if (action === 'accept') {
        // Update the event's attendees list
        await axios.put(`http://localhost:8080/luma/events/${eventId}/attendees`, {
          notificationId,
          status: 'accepted',
        
        });
      // Update the notification status to read

        // Show success toast
        toast.success('Guest approved!');
        
        // Invalidate event queries to refresh the UI
        queryClient.invalidateQueries(['events']);
      } else {
        toast.info('Guest rejected');
      }

      return response.data;
    },
    onSuccess: (data, { notificationId }) => {
      console.log('Notification action successful...');
      // Remove the notification from the list
      queryClient.setQueryData(['notifications'], (oldNotifications) =>
        oldNotifications ? oldNotifications.filter((n) => n._id !== notificationId):[]
      );
    },
    onError: (error) => {
      console.error('Error handling notification:', error);
      toast.error('Failed to process notification');
    },
    onSettled: () => {
      // Refetch the notification data
      queryClient.refetchQueries(['notifications']);
    },
  });

  return {
    notifications,
    error,
    isLoading,
    handleNotificationAction,
    isMutating,
  };
};

export default useNotification;