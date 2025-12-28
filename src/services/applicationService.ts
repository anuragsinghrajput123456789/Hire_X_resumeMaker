const API_URL = 'http://localhost:5000/api/applications';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

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
        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch applications');
        return await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

export const saveApplication = async (data: Omit<JobApplication, '_id' | 'createdAt'>) => {
    try {
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to save application');
        return await response.json();
    } catch (error) {
        console.error('Error saving application:', error);
        throw error;
    }
};

export const updateApplication = async (id: string, data: Partial<JobApplication>) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update application');
        return await response.json();
    } catch (error) {
        console.error('Error updating application:', error);
        throw error;
    }
};

export const deleteApplication = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete application');
        return await response.json();
    } catch (error) {
        console.error('Error deleting application:', error);
        throw error;
    }
};
