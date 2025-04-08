
export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-white ml-[20%]">

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Good evening, Yuvraj Mishra</h1>
        </div>

        {/* Recently Visited */}
        <div>
          <h2 className="text-lg font-semibold mb-3">🧠 Recently Visited</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {["That Month Of The Year", "Commerce Helper", "Accountancy", "Ho Gayi Hai Peer Parvat Si"].map((title, i) => (
              <div key={i} className="bg-[#2c2c2c] p-4 rounded-lg shadow hover:shadow-lg cursor-pointer">
                <div className="font-semibold">{title}</div>
                <div className="text-xs text-gray-400 mt-1">📅 Feb 1</div>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Box */}
        <div className="bg-[#2c2c2c] p-6 rounded-lg shadow-md max-w-2xl">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            📄 Welcome Page
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            This is your first page. You can create documents, take notes,
            organize tasks, and more. Click to start editing.
          </p>
        </div>

        {/* Add New Page */}
        <div className="mt-4 text-sm text-blue-400 hover:underline cursor-pointer">
          + Add a new page
        </div>
      </main>
    </div>
  );
}
