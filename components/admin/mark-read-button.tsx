"use client";

import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { markInquiryReadAction } from "@/server/actions/contact";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markInquiryReadAction(id);
          toast.success("Marked as read.");
          router.refresh();
        })
      }
      className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <Check className="size-3.5" aria-hidden />
      )}
      Mark as read
    </button>
  );
}
