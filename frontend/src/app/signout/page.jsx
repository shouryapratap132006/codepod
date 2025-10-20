"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  const handleSignOut = () => {
    // here you can clear auth or localStorage if needed
    router.push("/home");
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center h-[80vh] text-center">
      <LogOut className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-3">Sign Out</h1>
      <p className="text-gray-400 mb-6">Are you sure you want to log out of CodePod 2.0?</p>
      <button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg"
      >
        Confirm Sign Out
      </button>
    </div>
  );
}
