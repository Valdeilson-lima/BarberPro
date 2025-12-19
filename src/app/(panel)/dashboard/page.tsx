import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();
 

  if (!session) {
    redirect("/");
   
  }

  console.log("User session:", session?.user?.createdAt);

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4 text-white">Welcome to the Home Page</h1>
     <div className="w-full h-150  bg-gray-200 mb-10"></div>
      <div className="w-full h-150  bg-gray-500 mb-10"></div>
       <div className="w-full h-150  bg-gray-200 mb-10"></div>

    </main>
  );
}