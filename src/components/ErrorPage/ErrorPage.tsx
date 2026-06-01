import { memo } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default memo(function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] opacity-40"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        
        {/* Animated 404 Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-500 leading-none select-none drop-shadow-sm">
            404
          </h1>
        </motion.div>

        {/* Icon Floating Animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-white rounded-2xl mx-auto my-6 shadow-xl border border-slate-100 flex items-center justify-center"
        >
          <Search className="w-10 h-10 text-indigo-500" strokeWidth={2.5} />
        </motion.div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Page not found
        </h2>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
          Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-8 py-3.5 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <a
            href="/"
            className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
          >
            <Home size={18} />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
});