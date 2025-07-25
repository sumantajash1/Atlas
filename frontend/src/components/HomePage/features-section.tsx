import { GradientCard } from "@/components/ui/gradient-card"
import { Calendar, Settings, Activity, Users, Brain, BlindsIcon } from "lucide-react"
import CustomNode from "../CustomNode"

export function FeaturesSection() {
  const features = [
    {
      title: "Automatic Goal Breakdown",
      description: "Breaks down complex goals into actionable subtasks based on your input and chosen depth",
      icon: <Activity className="h-6 w-6 text-[#90e0ef]" />,
    },
    {
      title: "Field-Specific Intelligence",
      description: "Adapts plans to your preffered domain, making it smarter than generic to-do apps",
      icon: <Brain className="h-6 w-6 text-[#90e0ef]" />,
    },
    {
      title: "Biology-Aware Scheduling",
      description: "Plans around your sleep, and daily patterns to optimize when and how you work",
      icon: <Users className="h-6 w-6 text-[#90e0ef]" />,
    },
    {
      title: "Built-In Calendar Integration",
      description: "Displays your schedule with deadlines and priorities in one place for easy tracking and planning",
      icon: <Calendar className="h-6 w-6 text-[#90e0ef]" />,
    },
    {
      title: "Dynamic Task Chunking",
      description: "Automatically splits overwhelming tasks into smaller parts, making it easier to stay on track without burnout",
      icon: <BlindsIcon className="h-6 w-6 text-[#90e0ef]" />,
    },
    {
      title: "Flexible Rescheduling Support",
      description: "Quickly adjusts your plan if you fall behind or need to shift priorities",
      icon: <Settings className="h-6 w-6 text-[#90e0ef]" />,
    },
  ]

  return (
    <section id="features" className="py-16 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0077b6] to-[#48cae4]">
          Features Designed for Focus
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
        Atlas blends AI-driven planning, intelligent scheduling, and interactive mindmaps to help you stay focused, organized, and in control of your goals
        </p>
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {features.map((feature) => (
            <GradientCard key={feature.title} className="h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-4 p-3 rounded-full bg-white/5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>
    </section>
  )
}
