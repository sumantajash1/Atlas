import React from "react";
import { PlusIcon, TargetIcon, CalendarIcon, UserIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    icon: <PlusIcon className="w-6 h-6 mx-auto" />,
    label: "Add Goal",
    route: "/",
  },
  {
    icon: <TargetIcon className="w-6 h-6 mx-auto" />,
    label: "Goals",
    route: "/goals",
  },
  {
    icon: <CalendarIcon className="w-6 h-6 mx-auto" />,
    label: "Calendar",
    route: "/calendar",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col justify-between items-center h-screen w-16 bg-slate-800 py-4 fixed left-0 top-0 z-10">
      <div className="flex flex-col gap-8 w-full">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center w-full group focus:outline-none hover:cursor-pointer hover:text-white ${
                isActive ? "text-white" : "text-slate-300"
              }`}
              type="button"
            >
              {React.cloneElement(item.icon, {
                className: `w-6 h-6 mx-auto group-hover:text-white ${
                  isActive ? "text-white" : "text-slate-400"
                }`,
              })}
              <span
                className={`text-xs mt-1 group-hover:text-white text-center ${
                  isActive ? "text-white font-semibold" : "text-slate-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => navigate("/account")}
        className="mb-2 w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 hover:cursor-pointer transition-colors"
        type="button"
        aria-label="Account"
      >
        <UserIcon className="w-6 h-6 text-slate-300" />
      </button>
    </div>
  );
}
