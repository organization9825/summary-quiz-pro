import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

export const uploadPDF = async (file: File): Promise<{ summary: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to upload PDF');
    }
    throw new Error('Network error occurred');
  }
};

export const generateQuiz = async (): Promise<{ questions: any[] }> => {
  try {
    const response = await api.post('/generate-quiz');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to generate quiz');
    }
    throw new Error('Network error occurred');
  }
};

export default api;