"use client";
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <div className="bg-background flex items-center justify-center h-screen">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
