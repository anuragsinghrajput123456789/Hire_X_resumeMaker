import { apiUrl, authHeaders, apiFetch } from './apiClient';

const API_URL = apiUrl('/cold-email');

interface ColdEmailData {
  recipientName: string;
  recipientEmail?: string;
  recipientCompany?: string;
  recipientRole?: string;
  senderName: string;
  senderEmail?: string;
  jobTitle: string;
  experience?: string;
  skills?: string;
  personalNote?: string;
  content: string;
}

export const saveColdEmail = async (emailData: ColdEmailData) => {
    try {
        const response = await apiFetch(`${API_URL}/save`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(emailData)
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving cold email:', error);
        throw error;
    }
};

export const getColdEmailHistory = async () => {
    try {
        const response = await apiFetch(`${API_URL}/history`, {
            method: 'GET',
            headers: authHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const deleteColdEmail = async (id: string) => {
    try {
        const response = await apiFetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting email:', error);
        throw error;
    }
};
