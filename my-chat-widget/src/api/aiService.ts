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

// **Attach to window for browser console testing**
(window as any).getAIResponse = getAIResponse;
