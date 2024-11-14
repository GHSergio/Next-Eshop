"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AuthForm from "@/components/AuthForm";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex flex-col justify-center items-center bg-background p-0 rounded-md w-full min-h-screen">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
