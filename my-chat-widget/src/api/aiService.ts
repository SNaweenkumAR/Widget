import axios from 'axios';

export const getAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL,
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        },
      }
    );

    return response.data?.choices?.[0]?.message?.content || "AI response error.";
  } catch (error) {
    console.error('Error in AI service:', error);
    return "Sorry, there was an issue with the AI response.";
  }
};

export const uploadFiles = async (files: File[]): Promise<{fileUrl: string, fileName: string}[]> => {
  try {
    // Create a FormData object to send files
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    // Assuming you have an endpoint to handle file uploads
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        },
      }
    );
    
    // Return the URLs of the uploaded files
    return response.data.files || [];
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error('Failed to upload files');
  }
};

// Alternative implementation for local file handling if server upload is not available
export const handleFilesLocally = async (files: File[]): Promise<{fileUrl: string, fileName: string}[]> => {
  return files.map(file => ({
    fileUrl: URL.createObjectURL(file),
    fileName: file.name
  }));
};

// For messages with files
export const getAIResponseWithFiles = async (userMessage: string, files: File[]): Promise<string> => {
  try {
    // First, prepare file descriptions for context
    const fileDescriptions = files.map(file => 
      `File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)`
    ).join('\n');
    
    // Add file context to the message
    const messageWithContext = files.length > 0 
      ? `${userMessage}\n\nAttached files:\n${fileDescriptions}`
      : userMessage;
    
    // Use the same API call as before, but with enhanced context
    const response = await axios.post(
      import.meta.env.VITE_API_URL,
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: messageWithContext }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        },
      }
    );

    return response.data?.choices?.[0]?.message?.content || "AI response error.";
  } catch (error) {
    console.error('Error in AI service with files:', error);
    return "Sorry, there was an issue processing your message with attachments.";
  }
};

// **Attach to window for browser console testing**
(window as any).getAIResponse = getAIResponse;
(window as any).getAIResponseWithFiles = getAIResponseWithFiles;