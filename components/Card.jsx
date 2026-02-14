"use client";
import { createClient } from "@/utils/supabase";
import React from "react";

function Card({ bookmark }) {
  const supabase = createClient();

  const onDelete = async (id) => {
    try {
      const res = await supabase.from("bookmarks").delete().eq("id", id);
      alert("Deleted!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex rounded-2xl mb-5  flex-col p-3 gap-3 bg-slate-800 text-white">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl">{bookmark.title}</h1>
        <img
          onClick={() => onDelete(bookmark.id)}
          src="/delete.png"
          alt="delete"
          className="h-6 w-6"
        />
      </div>

      <span className="underline">{bookmark.url}</span>
    </div>
  );
}

export default Card;
