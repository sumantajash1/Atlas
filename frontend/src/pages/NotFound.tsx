import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0077b6] to-[#48cae4] mb-4">
          404
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>

        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a
          different location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="custom" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 opacity-20">
          <div className="w-32 h-32 mx-auto border-2 border-[#0077b6] rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-[#48cae4] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
