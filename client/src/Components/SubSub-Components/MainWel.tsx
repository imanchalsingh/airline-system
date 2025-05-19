import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const MainWel: React.FC = () => {
  return (
    <div className="max-h-screen w-full flex flex-col justify-center items-center overflow-hidden mt-30">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-[#2c7df8] drop-shadow-lg"
      >
        Welcome to SkyTrip ✈️
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-4 text-lg text-gray-700 text-center max-w-md"
      >
        Discover, book, and manage your flight reservations effortlessly.
      </motion.p>
      <motion.div
        className="-bottom-10 w-full flex justify-center"
        initial={{ y: 100 }}
        animate={{ y: 10 }}
        transition={{ delay: 1.5, duration: 1, ease: "linear" }}
      >
        <Sparkles className="w-32 opacity-30 animate-bounce size-60" />
      </motion.div>
    </div>
  );
};

export default MainWel;
