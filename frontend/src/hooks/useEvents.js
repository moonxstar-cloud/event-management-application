import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';

const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async() => {
            const response = await axiosInstance.get('/luma/home');
            console.log('Response:', response); // Add this line
            return response.data;
        },
        keepPreviousData: true,
    });
};

export default useEvents;