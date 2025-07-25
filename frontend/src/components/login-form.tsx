import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/context/UserContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Basic validation
      if (!email || !password) {
        setError("Please fill in all fields!");
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

      const res = await api.post("/user/signIn", {
        email,
        password,
      });

      if (res.status === 200) {
        login({
          ...res.data.second,
          token: res.data.first,
        });
        if (res.data.second.mobileNum) {
          navigate("/");
        } else navigate("/additional-details");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen -ml-16 flex justify-center items-center">
      <div
        className={cn("flex flex-col gap-6 bg-transparent w-sm", className)}
        {...props}
      >
        <Card className="bg-slate-800 border-none overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-slate-300">
                        Password
                      </Label>
                      {/* <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline text-slate-300"
                      >
                        Forgot your password?
                      </a> */}
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" variant="custom" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="text-center text-sm text-slate-300">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/sign-up"
                    className="underline underline-offset-4 text-slate-300 hover:text-white"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div> */}
      </div>
    </div>
  );
}
