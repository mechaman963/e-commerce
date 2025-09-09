"use client";

import React from "react";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Users, Package, Tags, TrendingUp, ShoppingCart, Eye } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="2,847"
          icon={Users}
          change="+12% from last month"
          changeType="positive"
          description="Active registered users"
        />
        <StatsCard
          title="Total Products"
          value="1,234"
          icon={Package}
          change="+8% from last month"
          changeType="positive"
          description="Products in inventory"
        />
        <StatsCard
          title="Categories"
          value="45"
          icon={Tags}
          change="+3 new categories"
          changeType="positive"
          description="Product categories"
        />
        <StatsCard
          title="Revenue"
          value="$24,567"
          icon={TrendingUp}
          change="+15% from last month"
          changeType="positive"
          description="Monthly revenue"
        />
        <StatsCard
          title="Orders"
          value="892"
          icon={ShoppingCart}
          change="+22% from last month"
          changeType="positive"
          description="Total orders this month"
        />
        <StatsCard
          title="Page Views"
          value="45,231"
          icon={Eye}
          change="+5% from last week"
          changeType="positive"
          description="Website page views"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - Takes 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="text-sm font-medium text-gray-900">127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Orders</span>
              <span className="text-sm font-medium text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Stock Items</span>
              <span className="text-sm font-medium text-red-600">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
