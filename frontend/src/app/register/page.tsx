"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterModal from "@/components/auth/RegisterModal";

export default function RegisterRoute() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    router.push("/");
  }, [router]);

  return (
    <RegisterModal
      isOpen={open}
      onClose={handleClose}
      onSwitchToLogin={() => router.push("/login")}
    />
  );
}
