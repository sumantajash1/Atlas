import { Button } from "@/components/ui/button";
import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { Play, Download } from "lucide-react";
import { ShineBorder } from "../ui/shine-border";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[900px] pb-16 overflow-hidden bg-slate-950 hero-gradient">
      <InteractiveGrid
        containerClassName="absolute inset-0"
        className="opacity-30"
        points={40}
      />

      <ShineBorder
        className="relative z-10 w-screen px-6 h-screen p-0 flex justify-center items-center"
        borderClassName="border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="text-center mb-16">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 tracking-tight margin-top-50">
            Adaptive Productivity
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0077b6] to-[#48cae4]">
              Designed for You
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Atlas turns chaos into clarity with AI-powered mindmaps and
            intelligent planning, tailored to your real-time needs and
            lifestyle.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/sign-up">
              <Button
                variant="custom"
                className="w-36"
                // className="bg-gradient-to-r from-[#0077b6] to-[#48cae4] text-white hover:opacity-90 gap-2 z-50"
              >
                {/* <Download className="w-4 h-4" /> */}
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* <ShineBorder className="relative mx-auto" borderClassName="border border-white/10 rounded-xl overflow-hidden">
          
        </ShineBorder> */}
      </ShineBorder>
    </section>
  );
}
