import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.EMERGENT_LLM_KEY,
    baseURL: 'https://llm.kindo.ai/v1'
  });
}

export async function generateBudgetPlan(userInput) {
  try {
    const openai = getOpenAIClient();
    const { location, guestCount, budget, preferences, sessionId } = userInput;
    
    const userMessage = `Düğün bütçe planı oluşturmama yardım et:
- Şehir: ${location}
- Misafir sayısı: ${guestCount}
- Toplam bütçe: ${budget} TL
- Öncelikler: ${preferences || 'Belirtilmedi'}

Lütfen detaylı bir maliyet dağılımı sağla (mekan, yemek, fotoğraf, gelin/damat kıyafeti, müzik, davetiye, çiçek, kına organizasyonu vb.) ve bütçeyi optimize etmek için öneriler sun.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a Turkish wedding planning expert assistant. Provide realistic Turkish wedding cost estimates. Include Turkish currency (TL) and traditional wedding expenses like kına gecesi, söz, and düğün. Be detailed and practical. Always respond in Turkish."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return {
      success: true,
      data: completion.choices[0].message.content,
      sessionId: sessionId || `wedding-budget-${Date.now()}`
    };
  } catch (error) {
    console.error('Error generating budget plan:', error);
    return {
      success: false,
      error: error.message || 'Bütçe planı oluşturulamadı'
    };
  }
}

export async function answerBudgetQuestion(question, sessionId) {
  try {
    const openai = getOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a Turkish wedding planning expert assistant. Answer questions about wedding budgets and planning. Always respond in Turkish."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return {
      success: true,
      data: completion.choices[0].message.content,
      sessionId: sessionId
    };
  } catch (error) {
    console.error('Error answering question:', error);
    return {
      success: false,
      error: error.message || 'Soru cevaplanamadı'
    };
  }
}
