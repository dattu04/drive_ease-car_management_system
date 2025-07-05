import * as ToastPrimitive from "@radix-ui/react-toast";
import { useState } from "react";

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function showToast(msg) {
    setMessage(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000); // Auto close after 3s
  }

  return {
    Toast: (
      <ToastPrimitive.Root open={open}>
        <ToastPrimitive.Description>{message}</ToastPrimitive.Description>
      </ToastPrimitive.Root>
    ),
    showToast,
  };
}
