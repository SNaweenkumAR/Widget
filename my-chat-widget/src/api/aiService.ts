import axios from 'axios';

export const getAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL,
      {
        model: "togethercomputer/llama-2-7b-chat",
        prompt: `<human>: ${userMessage}\n<bot>:`,
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

    return response.data.output.content;
  } catch (error) {
    console.error('Error in AI service:', error);
    throw new Error('Failed to get response from AI service');
  }
};