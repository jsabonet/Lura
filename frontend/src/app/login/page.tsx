"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";

export default function LoginRoute() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    router.push("/");
  }, [router]);

  return (
    <LoginModal
      isOpen={open}
      onClose={handleClose}
      onSwitchToRegister={() => router.push("/register")}
    />
  );
}
