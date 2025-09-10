"use client";

import React from "react";
import { Clock, User, Package, Tag, Eye } from "lucide-react";

interface ActivityItem {
  id: number;
  type: "user" | "product" | "category" | "view";
  action: string;
  target: string;
  time: string;
  user?: string;
}

const RecentActivity: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "product",
      action: "created",
      target: "iPhone 15 Pro",
      time: "2 hours ago",
      user: "Admin",
    },
    {
      id: 2,
      type: "user",
      action: "registered",
      target: "john.doe@email.com",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "category",
      action: "updated",
      target: "Electronics",
      time: "6 hours ago",
      user: "Manager",
    },
    {
      id: 4,
      type: "view",
      action: "viewed",
      target: "Samsung Galaxy S24",
      time: "8 hours ago",
    },
    {
      id: 5,
      type: "product",
      action: "deleted",
      target: "Old Product XYZ",
      time: "1 day ago",
      user: "Admin",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />;
      case "product":
        return <Package className="w-4 h-4" />;
      case "category":
        return <Tag className="w-4 h-4" />;
      case "view":
        return <Eye className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
      case "registered":
        return "text-green-600";
      case "updated":
        return "text-blue-600";
      case "deleted":
        return "text-red-600";
      case "viewed":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className={`font-medium ${getActionColor(activity.action)}`}>
                  {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                </span>{" "}
                <span className="font-medium">{activity.target}</span>
                {activity.user && (
                  <span className="text-gray-600"> by {activity.user}</span>
                )}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
