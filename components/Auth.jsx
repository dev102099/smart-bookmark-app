"use client";
import { createClient } from "@/utils/supabase";
import React, { useEffect, useState } from "react";

function Auth({ SignUp }) {
  const [user, setUser] = useState(false);
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const isUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user) {
      setUser(true);
    } else {
      setUser(false);
    }
    console.log(user);
  };

  useEffect(() => {
    isUser();
  }, []);
  return (
    <div
      hidden={user}
      className="absolute h-screen w-screen p-5 flex items-center justify-center top-0 bg-black/50"
    >
      <div className="bg-slate-800 w-fit text-white p-3 rounded-2xl">
        <h1 className="text-3xl font-semibold ">SignIn/SignUp</h1>
        <button
          onClick={handleLogin}
          className="flex items-center mt-5 font-semibold bg-white p-2 border border-gray-400 text-black gap-1 rounded-full"
        >
          <img src="/google.png" alt="google" height={20} width={20} /> Signup
          with Google
        </button>
      </div>
    </div>
  );
}

export default Auth;
