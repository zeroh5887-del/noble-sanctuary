// AI Service - Hugging Face Integration
// Using free models for Japanese language processing

// Predefined poetic Japanese responses for listening
// These will be used as templates until we integrate the AI model
const poeticResponses = [
  "そうですね。あなたの想いが聞こえます。",
  "深い想いをありがとうございます。",
  "その心の声、大切にしてください。",
  "あなたの気持ち、理解できます。",
  "続けてください。もっとお聞かせください。",
  "そのお気持ち、よく分かります。",
  "心の奥底にあるそれを、どうぞ。",
  "あなたの言葉が、ここにあります。",
  "その想いは、誰かの心に届きます。",
  "語り続けてください。その声は大切です。"
];

// Responses specific to crisis/despair
const crisisResponses = [
  "辛いのですね。その気持ち、わかります。",
  "一人ではありません。ここにいます。",
  "その想いをここで、表現してください。",
  "いのちの電話: 0570-783-556 - 専門家がいます。",
  "よりそいホットライン: 0120-279-338 - 話を聞きます。",
  "その痛み、大切な人生です。",
  "絶望の中にも、光があります。",
  "あなたの命は、大切です。"
];

export const getAIResponse = async (userMessage) => {
  try {
    // Check for crisis keywords
    const crisisKeywords = ['死', '自殺', '死にたい', '消えたい', '終わり', '無意味'];
    const isCrisis = crisisKeywords.some(keyword => userMessage.includes(keyword));

    if (isCrisis) {
      // Return crisis response with hotline
      const response = crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
      return response;
    }

    // For now, return a poetic listening response
    // TODO: Integrate with Hugging Face API for actual AI responses
    const response = poeticResponses[Math.floor(Math.random() * poeticResponses.length)];
    
    return response;
  } catch (error) {
    console.error('Error in AI service:', error);
    return "あなたの想いをお聞きします。どうぞ、続けてください。";
  }
};

// TODO: Implement Hugging Face API integration
// export const initializeHuggingFaceAPI = async (apiKey) => {
//   // Initialize with user's own API key or free tier
// };

// TODO: Implement actual language model inference
// export const generateAIResponse = async (userMessage, context) => {
//   // Use Hugging Face model to generate response
//   // Ensure response is:
//   // 1. Short (2-3 sentences max)
//   // 2. Poetic and profound
//   // 3. In classical Japanese
//   // 4. Focused on listening, not advice
// };
