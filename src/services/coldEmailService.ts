const API_URL = 'http://localhost:5000/api/cold-email';

const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token;

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

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
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(emailData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save email');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving cold email:', error);
        throw error;
    }
};

export const getColdEmailHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/history`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch history');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

export const deleteColdEmail = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete email');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting email:', error);
        throw error;
    }
};
