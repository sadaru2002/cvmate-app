import axios from 'axios';
import { toast } from 'sonner'; // Using sonner for toasts
import { redirect } from 'next/navigation'; // For server-side redirects, though client-side router.push is more common here

const api = axios.create({
  baseURL: '/api', // Next.js API routes are relative to the app
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error); // Keep for debugging
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // Return the response data directly for convenience
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message); // Keep for debugging

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          toast.error("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Use client-side router for navigation
          if (typeof window !== 'undefined') {
            window.location.href = '/auth'; // Full page reload to clear state
          }
          break;

        case 403:
          // Forbidden
          toast.error(data.message || "Access forbidden.");
          break;

        case 404:
          // Not found
          toast.error(data.message || "Resource not found.");
          break;

        case 400: // Bad Request, often for validation errors
        case 422: // Unprocessable Entity, specifically for validation errors
          let errorMessage = data.message || "Validation error. Please check your input.";
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            // Extract and join Zod error messages for a more detailed toast
            const detailedErrors = data.errors.map((err: any) => err.message).join('; ');
            errorMessage = `Validation failed: ${detailedErrors}`;
          }
          toast.error(errorMessage);
          if (data.errors) {
            console.error('Validation errors:', data.errors);
          }
          break;

        case 500:
          // Server error
          toast.error(data.message || "Server error. Please try again later.");
          break;

        default:
          toast.error(data.message || `An unexpected error occurred (Status: ${status}).`);
      }

      // Return the error data or a formatted error
      return Promise.reject(data || { message: 'An error occurred' });
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your internet connection.");
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      toast.error(error.message || "An unexpected error occurred.");
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;