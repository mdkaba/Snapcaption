"use client";
import React, { useEffect, useState } from "react"; // Removed unused `useMemo` import
import { motion } from "framer-motion";
import { nanoid } from "nanoid";

type Sparkle = {
  id: string;
  left: number;
  top: number;
  size: number;
};

const generateSparkle = (): Sparkle => ({
  id: nanoid(),
  left: Math.random() * 100, // Left position in percentage
  top: Math.random() * 100, // Top position in percentage
  size: Math.random() * 5 + 10, // Size of the sparkle in pixels
});

const Sparkles = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) => [...prev, generateSparkle()]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleRemoveSparkle = (id: string) => {
    setSparkles((prev) => prev.filter((sparkle) => sparkle.id !== id));
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => handleRemoveSparkle(sparkle.id)}
          className="absolute"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: "gold",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
