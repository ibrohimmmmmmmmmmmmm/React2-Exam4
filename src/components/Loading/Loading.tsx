import { useState, useEffect, memo } from "react";

export default memo(function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Optimizing your experience...",
    "Securing connection...",
    "Hang tight, internet is a bit slow today...",
    "Almost there, finishing touches...",
    "Getting things ready for you..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 3500); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-[#050505]">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="relative flex flex-col items-center">
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 rounded-full bg-blue-500/5 shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-pulse"></div>
          
          <svg className="w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#neonGradient)"
              strokeWidth="2"
              strokeDasharray="15 10"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center">
               <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="overflow-hidden">
            <p className="text-white text-sm font-light tracking-[0.2em] uppercase transition-all duration-700 ease-in-out">
              {messages[messageIndex]}
            </p>
          </div>

          <div className="relative w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 via-indigo-400 to-blue-500 animate-[progress_10s_ease-in-out_infinite]"
              style={{ width: '100%' }}
            ></div>
          </div>

          {messageIndex >= 2 && (
            <p className="text-gray-500 text-[10px] italic animate-fade-in">
              External server response is taking longer than usual...
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(0%); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
})