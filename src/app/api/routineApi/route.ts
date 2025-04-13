import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  // Extract both message and conversation history from request
  const { message, conversationHistory = [] } = await req.json();

  // Validate input
  const historyContext = conversationHistory
    .map((entry: any) => `User: ${entry.user}\nAssistant: ${entry.bot}`)
    .join('\n\n');


    const formattedPrompt = `
    You are an expert in habit-building, time management, and personal productivity. Your task is to generate a highly personalized and realistic daily routine based on the user's specific inputs, preferences, lifestyle, professional commitments, wellness goals, and energy patterns.
    
    Instructions:
    - Base your suggestions on the user's stated sleep patterns, work hours, hobbies, personal goals (e.g., fitness, learning, relaxation), and productivity preferences (e.g., deep work periods, breaks).
    - Time slots should be practical, spaced realistically, and avoid overlaps.
    - Be motivational and purpose-driven when assigning tasks (e.g., “Reflect on goals,” “Deep work session”).
    - Do NOT return any explanation, markdown formatting, or surrounding text. Return **only** the final JSON output.
    
    User Input: """${message}"""
    
    Generate a structured, balanced and *Detailed* routine divided into three parts: morning, afternoon, and evening.
    
    Your response **must** follow this strict JSON format:
    
    {
      "Day 01": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 02": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 03": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 04": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 05": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 06": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 07": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],     
      "Day 08": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],
      "Day 09": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ],     
      "Day 10": [
        { "time": "7:00 AM", "activity": "Wake up" },
        { "time": "10:00 PM", "activity": "Sleep" }
      ]
    }`;
    
    

  














  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: formattedPrompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';

  // Update conversation history
  const updatedHistory = [
    ...conversationHistory,
    { user: message, bot: reply }
  ];

  // Save to chat log
  const logPath = path.join(process.cwd(), 'chat-log.json');
  const chatLog = {
    timestamp: new Date().toISOString(),
    user: message,
    bot: reply
  };

  try {
    const existing = await fs.readFile(logPath, 'utf8').catch(() => '[]');
    const logs = JSON.parse(existing);
    logs.push(chatLog);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Failed to save chat log:', err);
  }

  // Return updated conversation history
  return new Response(JSON.stringify({
    reply,
    conversationHistory: updatedHistory
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}