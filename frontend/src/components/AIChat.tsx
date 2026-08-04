import { useState } from "react";

function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-6 py-4 shadow-2xl hover:bg-blue-700 transition z-50"
      >
        🤖 Talk to AI
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-w-[95%]">

            {/* Header */}
            <div className="bg-blue-600 text-white flex justify-between items-center px-5 py-4 rounded-t-2xl">
              <h2 className="font-bold text-lg">
                🤖 Verixa AI Assistant
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-xl"
              >
                ✖
              </button>
            </div>

            {/* Messages */}
            <div className="p-5 h-80 overflow-y-auto">

              <div className="bg-gray-100 rounded-xl p-4">
                👋 Namaste!

                <br /><br />

                Main Verixa AI Assistant hoon.

                <br /><br />

                Aapko kis service ki zarurat hai?

              </div>

            </div>

            {/* Input */}
            <div className="border-t p-4 flex gap-3">

              <input
                className="flex-1 border rounded-xl px-4 py-3 outline-none"
                placeholder="Type your message..."
              />

              <button className="bg-blue-600 text-white px-5 rounded-xl">
                Send
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default AIChat;