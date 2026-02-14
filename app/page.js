"use client";
import Card from "@/components/Card";
import { createClient } from "@/utils/supabase";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState(true);
  const [data, setData] = useState({ title: "", url: "" });
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const supabase = createClient();

  const onSubmit = async () => {
    try {
      if (data.title && data.url) {
        await supabase
          .from("bookmarks")
          .insert({ title: data.title, url: data.url, email: user.email });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      router.refresh();
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const getBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select()
        .eq("email", user.email);

      if (!error) {
        setBookmarks(data);
      } else {
        console.error("Fetch error:", error);
      }
    };

    getBookmarks();

    const channel = supabase
      .channel("custom-bookmark-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          console.log(" Database changed! Payload:", payload);

          getBookmarks();
        },
      )
      .subscribe((status) => {
        console.log("WebSocket Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  return (
    <>
      <div className="p-3 flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold ml-3">My Bookmarks</h1>
          <button
            onClick={signOut}
            className="p-1 pl-3 pr-3 bg-red-300 text-red-600 border border-red-600 rounded-2xl"
          >
            SignOut
          </button>
        </div>

        <div className="flex justify-center items-center p-3">
          <div
            onClick={() => setForm(!form)}
            className="cursor-pointer h-10 w-10 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center"
          >
            +
          </div>
        </div>

        {/*form*/}
        <div
          hidden={form}
          className="flex flex-col bg-gray-100 w-fit p-3 gap-3 rounded-xl shadow-xs self-center"
        >
          <h1 className="font-semibold text-xl">Add new bookmark:</h1>
          <div className="flex gap-2 items-center">
            <span>Title:</span>
            <input
              type="text"
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="pl-3 pr-3 pt-1 pb-1 rounded-xl focus:outline-none border"
            />
          </div>
          <div className="flex gap-2 items-center">
            <span>URL:</span>
            <input
              type="text"
              onChange={(e) => setData({ ...data, url: e.target.value })}
              className="pl-3 pr-3 pt-1 pb-1 rounded-xl focus:outline-none border"
            />
          </div>
          <button
            onClick={onSubmit}
            className="p-3 bg-slate-800 text-white rounded-lg cursor-pointer"
          >
            Submit
          </button>
        </div>
        <div className="lg:w-[40%] lg:self-center bg-gray-100 p-2 shadow-sm">
          {bookmarks.map((bookmark) => {
            return <Card key={bookmark.id} bookmark={bookmark} />;
          })}
        </div>
      </div>
    </>
  );
}
