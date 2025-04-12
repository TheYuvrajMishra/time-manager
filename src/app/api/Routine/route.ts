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
Generate a personalized daily routine for the following user preferences.

User Input: """${message}"""

Output the result in this JSON format only:

{
  "morning": [
    { "time": "7:00 AM", "activity": "Wake up" },
    { "time": "7:30 AM", "activity": "Exercise" }
  ],
  "afternoon": [
    { "time": "12:00 PM", "activity": "Lunch" },
    { "time": "1:00 PM", "activity": "Focus Work" }
  ],
  "evening": [
    { "time": "6:00 PM", "activity": "Walk" },
    { "time": "9:00 PM", "activity": "Read" }
  ]
}

Instructions:
- Tailor the routine to the user's lifestyle or goals.
- Be concise, motivational, and use realistic time blocks.
- Return **only** the pure JSON (no markdown/code formatting).
`;

  














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