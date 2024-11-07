import AuthForm from "@/components/AuthForm";

const AuthPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-background p-0 rounded-md w-full min-h-screen">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
