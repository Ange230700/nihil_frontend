// src\pages\Home.tsx

import { useEffect, useState } from "react";
import Spinner from "@nihil_frontend/components/Spinner";
import { useToast } from "@nihil_frontend/contexts/ToastContext";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Simulate data fetching
    const timeout = setTimeout(() => {
      setLoading(false);
      toast.show({
        severity: "success",
        summary: "Welcome!",
        detail: "You have successfully loaded the Home page.",
      });
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [toast]);

  if (loading) return <Spinner />;
  return <div>Home</div>;
}
