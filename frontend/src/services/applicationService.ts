import { apiUrl, authHeaders, apiFetch } from './apiClient';

const API_URL = apiUrl('/applications');

export interface JobApplication {
    _id: string;
    company: string;
    role: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    dateApplied: string;
    salary?: string;
    jobLink?: string;
    notes?: string;
    createdAt: string;
}


export const getApplications = async () => {
    try {
        const response = await apiFetch(API_URL, {
            headers: authHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

export const saveApplication = async (data: Omit<JobApplication, '_id' | 'createdAt'>) => {
    try {
        const response = await apiFetch(`${API_URL}/save`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving application:', error);
        throw error;
    }
};

export const updateApplication = async (id: string, data: Partial<JobApplication>) => {
    try {
        const response = await apiFetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating application:', error);
        throw error;
    }
};

export const deleteApplication = async (id: string) => {
    try {
        const response = await apiFetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting application:', error);
        throw error;
    }
};
