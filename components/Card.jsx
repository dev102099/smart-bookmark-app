import React from "react";

function Card({ bookmark }) {
  return (
    <div className="flex rounded-2xl mb-5  flex-col p-3 gap-3 bg-slate-800 text-white">
      <h1 className="font-semibold text-2xl">{bookmark.title}</h1>
      <span className="underline">{bookmark.url}</span>
    </div>
  );
}

export default Card;
