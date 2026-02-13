"use client";
import { createClient } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import React from "react";

function Nav() {
  const [user, setUser] = useState({});

  const supabase = createClient();

  const isUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      setUser({});
    }
    console.log(user);
  };
  useEffect(() => {
    isUser();
  }, []);
  return (
    <div className="w-screen bg-slate-800 flex justify-between p-3 items-center shadow-lg">
      <h1 className="text-white font-bold text-xl">Smart Bookmark App</h1>
      <div className="flex gap-2">
        <div className="h-10 w-10 rounded-full bg-red-400">
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Nav;
