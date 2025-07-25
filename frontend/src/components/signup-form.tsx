import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/context/UserContext";

export default function SignupForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get("fullName") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      // Basic validation
      if (!fullName || !email || !password || !confirmPassword) {
        setError("Please fill in all fields!");
        return;
      }

      if (fullName.trim().length < 2) {
        setError("Full name must be at least 2 characters long!");
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address!");
        return;
      }

      if (password.length < 4) {
        setError("Password must be at least 4 characters long!");
        return;
      }

      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      const res = await api.post("/user/signUp", {
        name: fullName,
        email,
        password,
      });
      console.log("asifs res", res.data);
      if (res.status === 200) {
        // not done
        login({
          userId: res.data.second.userId,
          name: res.data.second.name,
          email: res.data.second.email,
          token: res.data.first,
        });
        navigate("/additional-details");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen -ml-16 flex justify-center items-center">
      <Card className="mx-auto w-sm bg-slate-800 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Create a new Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input
                id="full-name"
                name="fullName"
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="me@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" variant="custom" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            <div className="text-center text-sm text-slate-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 text-slate-300 hover:text-white"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
