const API_URL = 'http://localhost:5000/api/resumes/';

// Get user token
const getToken = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return user.token;
  }
  return null;
};

// Save resume
const saveResume = async (resumeData: any) => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(resumeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to save resume');
  }

  return data;
};

// Get user resumes
const getResumes = async () => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch resumes');
  }

  return data.data;
};

// Delete resume
const deleteResume = async (id: string) => {
  const token = getToken();
  const response = await fetch(API_URL + id, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete resume');
  }

  return data;
};

const resumeService = {
  saveResume,
  getResumes,
  deleteResume,
};

export default resumeService;
