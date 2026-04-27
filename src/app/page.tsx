// src/app/page.tsx
import { auth } from "@/auth";
import LandingPage from "@/components/LandingPage";
import StudentHome from "@/components/StudentHome";

export default async function Home() {
  const session = await auth();

  // If the user is logged in, show them the food menu!
  if (session?.user) {
    return <StudentHome />;
  }

  // If they are NOT logged in, show them the awesome marketing page!
  return <LandingPage />;
}