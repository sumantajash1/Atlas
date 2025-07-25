import { Card } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  Calendar,
  Percent,
  Pencil,
  LogOut,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Generate avatar URL from user name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User"
  )}&background=0077b6&color=fff&size=128`;

  // User stats - you can replace these with real data from your API
  const stats = [
    {
      icon: <Clock className="h-6 w-6 text-[#90e0ef]" />,
      value: user?.sleepCycle || "Not set",
      label: "Sleep Cycle",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#90e0ef]" />,
      value: user?.dailyLimit || 0,
      label: "Max investment per day",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#90e0ef]" />,
      value: 0,
      label: "No of task generated",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-[#90e0ef]" />,
      value: 0,
      label: "No of tasks completed",
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#90e0ef]" />,
      value: 0,
      label: "No deadlines missed",
    },
    {
      icon: <Percent className="h-6 w-6 text-[#90e0ef]" />,
      value: user?.taskCompletionPercentage || 0,
      label: "Percentage completed",
    },
  ];

  return (
    <div className="w-[80%] mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white text-left">
        User Profile
      </h1>
      <div className="relative mb-8 w-full bg-slate-900 p-6 rounded-xl">
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="px-3 py-1 rounded-full flex items-center gap-1 transition-colors hover:bg-slate-800">
            <Pencil className="h-5 w-5 text-slate-400" />
            <span className="text-slate-100 font-medium">Edit</span>
          </button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="px-3 py-1 rounded-full flex items-center gap-1 transition-colors hover:bg-red-900/20 hover:border-red-500/20"
          >
            <LogOut className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">Logout</span>
          </Button>
        </div>
        <div className="flex items-center gap-6 text-left">
          <img
            src={avatarUrl}
            alt={user?.name || "User"}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#0077b6]"
          />
          <div>
            <div className="text-xl font-semibold text-white text-left">
              {user?.name || "User"}
            </div>
            <div className="text-slate-400 text-left">
              {user?.email || "No email"}
            </div>
            {user?.mobileNum && (
              <div className="text-slate-400 text-left">{user.mobileNum}</div>
            )}
          </div>
        </div>
      </div>
      <div className="relative bg-slate-900 rounded-xl p-6 w-full max-w-7xl">
        <button className="absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 transition-colors hover:bg-slate-800">
          <Pencil className="h-5 w-5 text-slate-400" />
          <span className="text-slate-100 font-medium">Edit</span>
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-white text-left">
          Information
        </h2>
        <div className="grid md:grid-cols-3 gap-x-6 gap-y-2">
          {stats.map((stat) => (
            <GradientCard
              key={stat.label}
              className="h-full w-full bg-slate-800"
            >
              <div className="flex flex-col items-start text-left h-full justify-center py-6">
                <div className="mb-2 rounded-full bg-slate-900 p-3 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>
    </div>
  );
}
