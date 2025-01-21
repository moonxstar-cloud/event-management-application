import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';

const useDiscover = () => {
    return useQuery({
        queryKey: ['discover-events'],
        queryFn: async() => {
            const response = await axiosInstance.get('/luma/discover');
            console.log('Response:', response); // Add this line
            return response.data;
        },
        keepPreviousData: true, // Keep previous data in cache
        onSuccess: (data) => {
            console.log('Data fetched successfully:', data);
          },
          onError: (error) => {
            console.error('Error fetching data:', error);
          },
    });
};

export default useDiscover;