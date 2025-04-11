import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { message } = await req.json();

  const formattedPrompt = `
You are a smart, friendly, and motivating assistant for a time-management website. 
Your primary role is to help users build productive and personalized routines, schedules, or tables, and format them in a useful, exportable way.

Behavior Guidelines:
- If the user input is a simple greeting or casual question (e.g., "Hi", "How are you?", "Good morning"), respond briefly and warmly.
- For routine-building or scheduling requests:
  - Respond in a clean markdown format using clear bullet points.
  - Break down routines by Morning, Afternoon, and Evening blocks.
  - Include time-specific actions when possible (e.g., 7:00 AM - Wake up).
  - Be motivational and time-conscious. Use phrases like “You’ve got this!” 💪, “Keep up the momentum!” or “Consistency is key!”.
  - Use emojis sparingly to uplift (✅, ⏰, 💡).

When the user specifically requests a:
1. **Routine table**, **schedule**, **planner**, or says "make a routine in table format", or
2. **HTML/CSS/JS version** of a table or planner,
then respond with the following structure:
- A fully self-contained HTML file with:
  - A styled table representing the schedule.
  - Responsive, minimal CSS for clean display.
  - Optional JavaScript if interactivity is needed.
- Include a downloadable button that triggers PDF generation using jsPDF or html2pdf.js.
- The entire code block must be wrapped as a valid HTML document (<!DOCTYPE html> ... </html>).

If the user says "export this as PDF", suggest HTML + JS code that enables PDF generation of the table/schedule.

Now respond to the user input below:

"""${message}"""
`;
 // keep your current prompt here

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

  // Save the chat as JSON
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

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
