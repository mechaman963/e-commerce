"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Sun, Moon, Cloud } from "lucide-react";
import Cookies from "universal-cookie";

const WelcomeSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Get user name from cookies
    const cookies = new Cookies();
    const userNameFromCookie = cookies.get("userName") || "User";
    setUserName(userNameFromCookie);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (hour < 17) return <Sun className="w-6 h-6 text-orange-500" />;
    return <Moon className="w-6 h-6 text-blue-500" />;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {getGreetingIcon()}
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {userName}!
            </h1>
          </div>
          <p className="text-blue-100 mb-1">
            Welcome back to your dashboard
          </p>
          <div className="flex items-center space-x-4 text-sm text-blue-100">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Cloud className="w-4 h-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-right">
            <p className="text-3xl font-bold">{formatTime(currentTime)}</p>
            <p className="text-sm text-blue-100">
              {currentTime.toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric" 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
