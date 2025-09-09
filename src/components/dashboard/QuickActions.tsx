"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, Plus, Users, Package, Tags } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  href,
  icon: Icon,
  color,
}) => {
  return (
    <Link
      href={href}
      className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const QuickActions: React.FC = () => {
  const actions: QuickActionProps[] = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      href: "/dashboard/products/new-product",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Add New User",
      description: "Create a new user account",
      href: "/dashboard/users/new-user",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Add New Category",
      description: "Create a new product category",
      href: "/dashboard/categories/new-category",
      icon: Tags,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
