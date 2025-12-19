import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function Plans() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  return <div>Plans Page</div>;
}