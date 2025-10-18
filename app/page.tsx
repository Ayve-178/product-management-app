'use client'

import ProtectedRoute from "@/components/auth/protected-route";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/products");
  }, []);

  return <ProtectedRoute>Loading...</ProtectedRoute>;
}
