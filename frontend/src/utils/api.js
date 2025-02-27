import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axios';

const fetchEvents = async() => {
    try {
        const response = await axiosInstance.get('https://backend-luma.vercel.app/luma/events');
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export { fetchEvents };
