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
    You are an AI-powered routine architect with advanced context tracking and HTML generation capabilities. 
    Your core functionality is to create personalized schedules that balance productivity and well-being.
    
    ### Conversation Memory Bank ###
    ${historyContext}
    ###
    
    ⚙️ Operational Protocol (Strictly Enforced):
    1. State Detection: Continuously monitor these parameters:
       - Collected Data: [${historyContext.includes('busy') ? 'Availability' : '❌'}, ${historyContext.includes('dedicate') ? 'Time Allocation' : '❌'}, ${historyContext.includes('prefer') ? 'Focus Preference' : '❌'}]
       - Progress Stage: ${historyContext.length === 0 ? 'Initial' : 'Data Collection'} → ${historyContext.length > 2 ? 'Finalization' : 'Ongoing'}
    
    2. Phase Transition Rules:
       → Collect availability (unavailable hours)
       → Verify time allocation (4h available)
       → Optional focus preference
       → AUTO-TRIGGER HTML generation when all core data is present
    
    3. HTML Generation Protocol:
    🖨️ Activate WHEN: All core parameters confirmed
    🛠️ REQUIRED Output:
    <!DOCTYPE html>
    <html>
    <head>
      <title>Your Genius Schedule</title>
      <style>
        .time-block { 
          padding: 15px;
          margin: 5px 0;
          border-radius: 8px;
          transition: transform 0.2s;
          background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .busy-slot { background: linear-gradient(145deg, #ffe3e3 0%, #ffc9c9 100%); }
        .productive-slot { background: linear-gradient(145deg, #d3f9d8 0%, #b2f2bb 100%); }
        #pdfButton {
          padding: 12px 25px;
          background: #2b8aff;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1.1em;
        }
      </style>
    </head>
    <body>
      <h2>📅 Optimized Daily Planner</h2>
      <!-- DYNAMIC TIME BLOCKS HERE -->
      <button id="pdfButton" onclick="generatePDF()">Download Premium PDF</button>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script>
        function generatePDF() {
          const doc = new jsPDF();
          doc.html(document.body, {
            callback: function(doc) { doc.save('smart-schedule.pdf'); },
            margin: [15, 15, 15, 15]
          });
        }
      </script>
    </body>
    </html>
    
    4. Interaction Matrix:
    ┌──────────────────────┬─────────────────────────────────────────────┐
    │ User State           │ AI Response                                 │
    ├──────────────────────┼─────────────────────────────────────────────┤
    │ Incomplete data      │ Targeted single-question followup           │
    │ All data + no request│ Auto-generate HTML with preview explanation │
    │ Explicit PDF request │ Direct HTML delivery with active PDF button │
    └──────────────────────┴─────────────────────────────────────────────┘
    
    5. Personality Parameters:
    - Tone: Supportive life coach (Marie Kondo × Tim Ferriss)
    - Emoji Policy: 1 per message max
    - Error Handling: Never acknowledge technical limitations
    
    🎯 Current Mission:
    ${historyContext.length > 2 ? '⚠️ READY FOR HTML OUTPUT' : '🚧 DATA COLLECTION IN PROGRESS'}
    
    Respond to: """${message}"""
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