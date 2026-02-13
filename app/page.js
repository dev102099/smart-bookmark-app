import Card from "@/components/Card";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="p-3">
        <h1 className="text-xl font-semibold ml-3">My Bookmarks</h1>
        <div className="flex justify-center items-center p-3">
          <div className="h-10 w-10 shadow-lg rounded-full bg-slate-800 text-white flex justify-center items-center">
            +
          </div>
        </div>
        <div className="w-full bg-gray-100 p-2 shadow-sm">
          <Card />
        </div>
      </div>
    </>
  );
}
