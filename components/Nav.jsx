"use client";

function Nav({ user }) {
  return (
    <div className="w-screen bg-slate-800 flex justify-between p-3 items-center shadow-lg">
      <h1 className="text-white font-bold text-xl">Smart Bookmark App</h1>
      <div className="flex gap-2">
        <div className="h-10 w-10 rounded-full bg-red-400">
          <img
            src={user.user_metadata?.avatar_url}
            alt=""
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
