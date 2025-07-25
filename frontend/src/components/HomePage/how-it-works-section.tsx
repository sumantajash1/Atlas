import { ShineBorder } from "@/components/ui/shine-border"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Input Your Goal",
      description: "Enter your goal, deadline and select how deeply you want to explore it.",
      color: "from-slate-300 to-slate-400",
    },
    {
      number: "02",
      title: "Get an Intelligent Mind Map",
      description: "Atlas breaks your goal into structured subtasks and visualizes them as an interactive mind map tailored to your domain, depth, and schedule.",
      color: "from-cyan-400 to-cyan-500",
    },
    {
      number: "03",
      title: "Schedule with Smart Precision",
      description: "Atlas syncs your tasks to the calendar, intelligently adapting to your sleep cycle, energy levels, and daily routines for optimal productivity.",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      number: "04",
      title: "Track and Adapt Effortlessly",
      description: "Stay on course with a focused daily view, while Atlas reschedules missed tasks and refines your plan in real time.",
      color: "from-cyan-600 to-cyan-800",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0077b6] to-[#48cae4]">How Atlas Works</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
        Atlas simplifies your planning with AI-driven structure, smart scheduling, and dynamic visualization, so you focus more on doing and less on organizing.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <ShineBorder key={step.number} className="h-full" borderClassName="border border-white/10 rounded-xl">
              <div className="p-6 h-full">
                <div className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${step.color} mb-4`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute bottom-6 right-0 transform translate-x-1/2 translate-y-1/2 z-10">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 8L20 32M20 32L32 20M20 32L8 20"
                        stroke="slate-950"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={index % 2 === 0 ? "rotate-90" : "rotate-0"}
                      />
                    </svg>
                  </div>
                )}
              </div>
            </ShineBorder>
          ))}
        </div>
      </div>
    </section>
  )
}
