// Ancient Japanese AI Service
// Focuses on poetic, profound responses using ancient words
// 2-3 sentences max
// Local processing only - no server calls

const ancientResponses = {
  greeting: [
    "心配しないで。ここにいます。",
    "嘆かないで。一緒にいます。",
    "あなたの声を聞きます。どうぞ。",
    "その想いを、ここで。",
    "心の奥から、声を出してください。"
  ],
  listening: [
    "そうですね。もっと聞かせてください。",
    "その心の声、大切にしてください。",
    "語り続けてください。ここが安全です。",
    "あなたの言葉は、ここに在ります。",
    "続けてください。聞いています。"
  ],
  pain: [
    "その痛み、わかります。一緒です。",
    "苦しいのですね。ここにいます。",
    "その心の重さ、感じています。",
    "辛いですね。でも一人ではありません。",
    "その悲しみ、聞いています。"
  ],
  crisis: [
    "いのちの電話: 0570-783-556 - 専門家がいます。今すぐ電話してください。",
    "絶望の中にも、光があります。よりそいホットライン: 0120-279-338",
    "あなたの命は、大切です。今、助けを求めてください。TELL: 03-5774-0992",
    "一人ではありません。専門家が助けます。いのちの電話にお電話ください。",
    "その想い、専門家に話してください。あなたは大切な存在です。"
  ],
  hope: [
    "明日も、一緒にいます。",
    "その光を、大切にしてください。",
    "小さな希望も、大きな光になります。",
    "あなたは、ここにいます。",
    "生きることは、美しいです。"
  ]
};

const crisisKeywords = [
  '死', '自殺', '死にたい', '消えたい', '終わり', '無意味',
  '生きたくない', '死ぬ', '命', '終わる', '逝く', '苦しい'
];

const painKeywords = [
  '辛い', '苦しい', '悲しい', '辛う', '悲しむ', '泣く', '苦', '痛い',
  'つらい', '絶望', '孤独', '一人', 'lonely', 'sad', 'pain'
];

export const getAncientAIResponse = async (userMessage) => {
  try {
    // Check for crisis
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      userMessage.includes(keyword)
    );

    if (hasCrisisKeyword) {
      const response = crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
      return {
        text: response,
        isCrisis: true,
        type: 'crisis'
      };
    }

    // Check for pain
    const hasPainKeyword = painKeywords.some(keyword => 
      userMessage.includes(keyword)
    );

    if (hasPainKeyword) {
      const response = ancientResponses.pain[Math.floor(Math.random() * ancientResponses.pain.length)];
      return {
        text: response,
        isCrisis: false,
        type: 'pain'
      };
    }

    // Check if it's a greeting or starting message
    if (userMessage.length < 10) {
      const response = ancientResponses.greeting[Math.floor(Math.random() * ancientResponses.greeting.length)];
      return {
        text: response,
        isCrisis: false,
        type: 'greeting'
      };
    }

    // Default listening response
    const responseType = Math.random() > 0.5 ? 'listening' : 'hope';
    const response = ancientResponses[responseType][Math.floor(Math.random() * ancientResponses[responseType].length)];
    
    return {
      text: response,
      isCrisis: false,
      type: responseType
    };
  } catch (error) {
    console.error('Error in Ancient AI service:', error);
    return {
      text: "あなたの想いをお聞きします。どうぞ。",
      isCrisis: false,
      type: 'default'
    };
  }
};

const crisisResponses = ancientResponses.crisis;
