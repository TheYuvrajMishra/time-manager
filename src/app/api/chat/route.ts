import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    const historyContext = conversationHistory
      .map((entry: any) => `User: ${entry.user}\nAssistant: ${entry.bot}`)
      .join('\n\n');

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

      Previous conversation:
      ${historyContext}

      Now respond to the user input below:

      """${message}"""
    `;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: formattedPrompt }],
            },
          ],
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
