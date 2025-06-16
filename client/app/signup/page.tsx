"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileData } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { Check, Eye, EyeOff, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { signUp } from "../api";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPass: string;
  }>({ firstName: "", lastName: "", email: "", password: "", confirmPass: "" });

  const passwordRequirements = [
    { text: "At least 8 characters", met: userData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(userData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(userData.password) },
    { text: "Contains number", met: /\d/.test(userData.password) },
  ];

  const router = useRouter();
  const [setData] = useProfileData(useShallow((state) => [state.setData]));

  const { mutate: signUpFn, isPending } = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      signUp(data),
    onSuccess: (data: any) => {
      toast.success("Sign up successfull");
      const { data: rspData } = data;
      const { loginUser: user } = rspData;
      setData({
        id: user.id,
        email: user.email,
        name: user.name,
        persona: user.persona,
      });
      router.push("/chat");
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("Error signing up", {
        description: error.message || "Please try later!!!",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: userData.firstName + " " + userData.lastName,
      email: userData.email,
      password: userData.password,
    };
    signUpFn(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-purple-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <Card className="w-full max-w-md glass-effect border-0 shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Create account
          </CardTitle>
          <CardDescription>
            Join LLM Paglu and start conversations with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData((prevData) => ({
                      ...prevData,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {userData.password && (
                <div className="space-y-2 mt-2">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Check
                        className={`w-3 h-3 ${
                          req.met ? "text-green-500" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          req.met ? "text-green-500" : "text-muted-foreground"
                        }
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  disabled={
                    userData.password === "" ||
                    !passwordRequirements.every(
                      (requirement) => requirement.met
                    )
                  }
                  value={userData.confirmPass}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      confirmPass: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {userData.password !== userData.confirmPass &&
                userData.password &&
                userData.confirmPass && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <X className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">
                        Password didn&apos;t match
                      </span>
                    </div>
                  </div>
                )}
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isLoading || isPending}
            >
              {isLoading || isPending
                ? "Creating account..."
                : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
