import { Button } from "@/components/ui/button"
import { Github, Twitter, Instagram } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span className="font-medium text-white">Atlas</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
            Atlas is an AI-powered productivity tool that helps users break down large goals into actionable subtasks, visualize them using interactive mindmaps, and schedule everything around their real-life routines for better focus and progress.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Twitter className="h-4 w-4 text-slate-100" />
              </Button>
              <Button
                variant="outline"
                size="icon" 
                className="rounded-full border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Github className="h-4 w-4 text-slate-100" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Instagram className="h-4 w-4 text-slate-100" />
              </Button>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-2 items-center justify-end">
            <Button className="bg-gradient-to-r from-[#0077b6] to-[#48cae4] text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-md hover:opacity-90 transition">
              Try Atlas Today
            </Button>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Atlas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
