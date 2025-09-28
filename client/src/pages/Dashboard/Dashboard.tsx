/* eslint-disable @typescript-eslint/no-unused-vars */
























import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../utils/NotificationSystem";
import Loading from "../../utils/Loading";
import Error from "../../utils/ErrorProps";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { mockStats, mockSalesData, mockCategoryData, mockInventoryData } from "../../types/data";
import Products from "./Products";

const Dashboard = () => <div className="p-6">Hello Dashboard</div>;
const Product = () => <div className="p-6"><Products /></div>
const Inventory = () => <div className="p-6">Hello Inventory</div>;
const Orders = () => <div className="p-6">Hi Orders</div>;
const Customers = () => <div className="p-6">Hi Customers</div>;
const Analytics = () => <div className="p-6">Hi Analytics</div>;
const Setting = () => <div className="p-6">Settings Page</div>;

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        addNotification("Dashboard load failed", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    return () => clearInterval(timer);
  }, []);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin" },
    { id: "Product", label: "Products", icon: Home, href: "/admin" },
    { id: "inventory", label: "Inventory", icon: Package, href: "/admin/inventory" },
    { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { id: "setting", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const stats = [
    {
      title: "Total Products",
      value: mockStats.totalProducts.toLocaleString(),
      trend: "+12% from last month",
      icon: <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      color: "bg-primary-500",
    },
    {
      title: "Total Value",
      value: `$${mockStats.totalValue.toLocaleString()}`,
      trend: "+8% from last month",
      icon: <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      color: "bg-success-500",
    },
    {
      title: "Low Stock Items",
      value: mockStats.lowStock.toString(),
      icon: <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      color: "bg-warning-500",
    },
    {
      title: "Out of Stock",
      value: mockStats.outOfStock.toString(),
      icon: <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      color: "bg-error-500",
    },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", total: "$124.99", status: "active", date: "2h ago" },
    { id: "#ORD-002", customer: "Jane Smith", total: "$89.50", status: "pending", date: "4h ago" },
    { id: "#ORD-003", customer: "Mike Johnson", total: "$256.00", status: "active", date: "6h ago" },
    { id: "#ORD-004", customer: "Sarah Wilson", total: "$45.75", status: "inactive", date: "8h ago" },
  ];

  const lowStockItems = [
    { name: "iPhone 15 Pro", stock: 5, threshold: 20, category: "Electronics" },
    { name: "MacBook Air M2", stock: 8, threshold: 15, category: "Computers" },
    { name: "AirPods Pro", stock: 12, threshold: 25, category: "Audio" },
    { name: "iPad Air", stock: 3, threshold: 10, category: "Tablets" },
  ];

  // Chart Data
  const demandSupplyData = [
    { month: "Jan", demand: 250, supply: 0 },
    { month: "Feb", demand: 200, supply: 50 },
    { month: "Mar", demand: 150, supply: 100 },
    { month: "Apr", demand: 100, supply: 150 },
    { month: "May", demand: 50, supply: 200 },
    { month: "Jun", demand: 0, supply: 250 },
  ];

  const diminishingReturnsData = [
    { input: 0, output: 0 },
    { input: 1, output: 80 },
    { input: 2, output: 150 },
    { input: 3, output: 200 },
    { input: 4, output: 230 },
    { input: 5, output: 250 },
    { input: 6, output: 260 },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getComponent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "Product": return <Product />;
      case "inventory": return <Inventory />;
      case "orders": return <Orders />;
      case "customers": return <Customers />;
      case "analytics": return <Analytics />;
      case "settings": return <Settings />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
              {sidebarItems.find((item) => item.id === activeTab)?.label} Page
            </h3>
            <p className="text-foreground-secondary dark:text-foreground-secondary-dark">
              This section is under development.
            </p>
          </div>
        );
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => { setError(null); setIsLoading(true); }} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-info-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-background-dark text-foreground dark:text-foreground-dark">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-r border-border/50 dark:border-border-dark/50 transform transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:shadow-glow-lg`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-border/50 dark:border-border-dark/50 bg-gradient-to-r from-primary-500 to-secondary-500">
          <h1 className="text-2xl font-display font-bold text-white drop-shadow-md">
            Ojaflow 
          </h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-white/20 transition-all duration-300"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
                className={`w-full flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105"
                    : "text-foreground-secondary dark:text-foreground-secondary-dark hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:shadow-md"
                }`}
              >
                <Icon size={20} className="mr-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navigation */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-border/50 dark:border-border-dark/50 shadow-md">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300"
              >
                <Menu size={24} />
              </button>

              <div className="relative ml-4 hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="inventory-input pl-12 pr-4 py-2 w-80 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  placeholder="Search products, orders..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300">
                <Bell size={24} className="text-foreground dark:text-foreground-dark" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>

              <div className="flex items-center space-x-3 group">
                <img
                  className="h-10 w-10 rounded-full ring-2 ring-primary-500 transition-all duration-300 group-hover:ring-4"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Admin avatar"
                />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-foreground dark:text-foreground-dark transition-all duration-300 group-hover:text-primary-500">
                    User
                  </div>
                  <div className="text-xs text-foreground-secondary dark:text-foreground-secondary-dark">
                  ojaflow.com
                  </div>
                </div>
                <ChevronDown size={18} className="text-neutral-400 transition-all duration-300 group-hover:text-primary-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 sm:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Hero Header */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-3xl font-display font-bold mb-2 drop-shadow-md">
                  Welcome to Ojaflow Dashboard
                </h2>
                <p className="text-lg text-white/80">
                  Manage your inventory with ease. Today is{" "}
                  {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}{" "}
                  at {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="inventory-card p-6 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl shadow-2xl hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground-secondary dark:text-foreground-secondary-dark">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground dark:text-foreground-dark mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full`}>
                        {stat.icon}
                      </div>
                    </div>
                    {stat.trend && (
                      <div className="mt-4 flex items-center">
                        <TrendingUp size={18} className="mr-2 text-success-500 animate-pulse" />
                        <span className="text-sm font-medium text-success-500">{stat.trend}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales & Inventory Trend */}
                <div className="inventory-card bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl shadow-2xl p-6 h-96">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
                      Sales & Inventory Trend
                    </h3>
                    <button className="text-sm text-primary-500 hover:text-primary-600">View Details</button>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockSalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#4B5563" />
                        <YAxis stroke="#4B5563" />
                        <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF" }} />
                        <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" dataKey="inventory" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Demand and Supply Flow */}
                <div className="inventory-card bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl shadow-2xl p-6 h-96">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
                      Demand & Supply Flow
                    </h3>
                    <button className="text-sm text-primary-500 hover:text-primary-600">View Details</button>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={demandSupplyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#4B5563" />
                        <YAxis stroke="#4B5563" />
                        <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF" }} />
                        <Line type="monotone" dataKey="demand" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="supply" stroke="#EF4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Distribution (Rainbow Pie) */}
                <div className="inventory-card bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl shadow-2xl p-6 h-96">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
                      Category Distribution
                    </h3>
                  </div>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color === "#3B82F6" ? "#6B46C1" : entry.color === "#10B981" ? "#10B981" : entry.color === "#F59E0B" ? "#F59E0B" : "#9333EA"} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {mockCategoryData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color === "#3B82F6" ? "#6B46C1" : item.color === "#10B981" ? "#10B981" : item.color === "#F59E0B" ? "#F59E0B" : "#9333EA" }}></div>
                          <span className="text-foreground-secondary dark:text-foreground-secondary-dark">{item.name}</span>
                        </div>
                        <span className="font-medium text-foreground dark:text-foreground-dark">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diminishing Returns and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Diminishing Returns */}
                <div className="inventory-card bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl shadow-2xl p-6 h-96">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
                      Diminishing Returns
                    </h3>
                    <button className="text-sm text-primary-500 hover:text-primary-600">View Details</button>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="input" name="Input" unit="" stroke="#4B5563" />
                        <YAxis dataKey="output" name="Output" unit="" stroke="#4B5563" />
                        <ZAxis range={[64]} />
                        <Tooltip contentStyle={{ backgroundColor: "#1F2937", color: "#FFFFFF" }} />
                        <Scatter data={diminishingReturnsData} fill="#6B46C1" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="inventory-card bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-xl shadow-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
                      Recent Activity
                    </h3>
                    <button className="text-sm text-primary-500 hover:text-primary-600 hidden sm:inline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {mockInventoryData.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground dark:text-foreground-dark truncate">{item.name}</p>
                            <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-medium text-foreground dark:text-foreground-dark">{item.quantity} units</p>
                          <p className="text-sm text-foreground-secondary dark:text-foreground-secondary-dark hidden sm:block">{item.lastUpdated}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "dashboard" && getComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;