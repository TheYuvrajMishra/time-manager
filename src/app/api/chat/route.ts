import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    // Trim conversation history to the last 5 exchanges to avoid context overload
    const trimmedHistory = conversationHistory.slice(-10);

    // Create the conversation context with roles for user and assistant
    const messages = [
      {
        role: 'user',
        parts: [
          {
            text: `
You are a smart, friendly, and motivating assistant for a time-management website. 
Your core focus is to support users in being more productive by sharing helpful advice, tips, or encouragement — *not* by creating full routines unless explicitly asked.

Behavior Guidelines:
- Always stay on-topic with productivity, time management, focus, and motivation. Generate only sharp, to-the-point responses. Avoid big paragraphs. Use attractive colorfull Emojis
- If the user greets you or makes small talk (e.g., "Hi", "How are you?"), respond briefly and warmly, but keep the tone aligned with productivity.
- Never suggest or generate routines, planners, or schedules unless the user explicitly and clearly requests one (e.g., “Can you make me a routine?”).
- Do **not** generate HTML, CSS, or JavaScript **under any circumstances**, unless the user specifically and repeatedly insists on having code.
- If a user requests an export or PDF, politely say that you can help with formatting suggestions, but only generate code if they insist.

Style and Tone:
- Use clean markdown format (never HTML) with bullet points when giving structured information.
- Keep your responses motivational, supportive, and time-conscious.
- Use uplifting phrases sparingly (like “You’ve got this!” 💪 or “Let’s stay on track!”) and light emojis (✅, ⏰, 💡).

Important Limitations:
- If the user asks about topics outside of productivity, politely refuse to answer and gently guide them back to the subject of productivity or time management.

---

Below is the conversation history, which will help you understand the user's context. Use this to guide your responses:
          `
        }
      ]
    },
    // Adding prior conversation history with user and assistant roles
    ...trimmedHistory.flatMap((entry: any) => [
      { role: 'user', parts: [{ text: entry.user }] },
      { role: 'model', parts: [{ text: entry.bot }] }
    ]),
    // The current user message
    { role: 'user', parts: [{ text: message }] }
  ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEW_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages
        }),
      }
    );

    const result = await geminiRes.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Error generating response:', err);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
