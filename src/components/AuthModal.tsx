import React, { useEffect } from "react";
import AuthForm from "./AuthForm";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setIsAuthModalOpen } from "@/store/slice/userSlice";

const AuthModal: React.FC = () => {
  const isAuthModalOpen = useSelector(
    (state: RootState) => state.user.isAuthModalOpen
  );
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setIsAuthModalOpen(false));
    }
  }, [isLoggedIn, dispatch, router]);

  const handleOnCloseModal = () => {
    dispatch(setIsAuthModalOpen(false));
  };

  return (
    <div
      className={`${
        isAuthModalOpen ? "block" : "hidden"
      } fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
    >
      <div className="relative p-0 rounded-md max-w-md xs:w-50 md:w-full">
        <button
          onClick={handleOnCloseModal}
          className="absolute top-2 right-2 xs:text-xs md:text-2xl font-bold xs:px-1 xs:py-0 md:px-2 md:py-0"
        >
          ×
        </button>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthModal;
