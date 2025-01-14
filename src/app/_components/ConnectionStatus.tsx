"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Socket } from "socket.io-client";

interface ConnectionStatusProps {
  socket: Socket;
}

export function ConnectionStatus({ socket }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [signalStrength, setSignalStrength] = useState<number>(0);

  useEffect(() => {
    let pingInterval: NodeJS.Timeout;
    let lastPing = Date.now();

    const checkLatency = () => {
      lastPing = Date.now();
      socket.emit("ping");
    };

    socket.on("connect", () => {
      setIsConnected(true);
      // Start ping checks when connected
      pingInterval = setInterval(checkLatency, 2000);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setLatency(null);
      setSignalStrength(0);
      if (pingInterval) clearInterval(pingInterval);
    });

    socket.on("pong", () => {
      const currentLatency = Date.now() - lastPing;
      setLatency(currentLatency);
      
      // Calculate signal strength based on latency
      if (currentLatency < 50) {
        setSignalStrength(4); // Excellent
      } else if (currentLatency < 100) {
        setSignalStrength(3); // Good
      } else if (currentLatency < 200) {
        setSignalStrength(2); // Fair
      } else {
        setSignalStrength(1); // Poor
      }
    });

    // Initial ping check
    checkLatency();

    return () => {
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [socket]);

  const getSignalColor = () => {
    switch (signalStrength) {
      case 4: return "text-pink-400";
      case 3: return "text-pink-300";
      case 2: return "text-pink-200";
      case 1: return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getSignalBars = () => {
    return Array(4).fill(0).map((_, i) => (
      <motion.div
        key={i}
        initial={{ height: 8 }}
        animate={{ 
          height: i < signalStrength ? [8, 12, 8] : 8,
          opacity: i < signalStrength ? 1 : 0.2
        }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.1
        }}
        className={`w-1.5 rounded-full ${getSignalColor()} bg-current`}
      />
    ));
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isConnected ? "connected" : "disconnected"}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex items-center gap-4 bg-black/50 rounded-lg px-4 py-2 border border-pink-500/20"
      >
        <div className="flex flex-col items-start">
          <div className={`text-sm font-medium ${isConnected ? "text-pink-400" : "text-red-400"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
          {latency !== null && (
            <div className="text-xs text-pink-200/70">
              {latency}ms latency
            </div>
          )}
        </div>

        <div className="flex items-end gap-1 h-4">
          {getSignalBars()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 