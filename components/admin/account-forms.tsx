"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { z } from "zod";
import { changePasswordAction, updateProfileAction } from "@/server/actions/auth";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/server/validators/auth";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address.")
    .max(200),
});

interface ProfileValues {
  name: string;
  email: string;
}

export function ProfileForm({ owner }: { owner: { name: string; email: string } }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileValues>,
    defaultValues: { name: owner.name, email: owner.email },
    mode: "onBlur",
  });
  const { register, formState, setError } = form;

  function save(values: ProfileValues) {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(field as keyof ProfileValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
        toast.error(result.error ?? "Could not update your profile.");
        return;
      }
      toast.success("Profile updated.");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(save)}
      noValidate
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-name">Name *</Label>
          <Input id="profile-name" autoComplete="name" {...register("name")} />
          <FieldError>{formState.errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="profile-email">Email *</Label>
          <Input id="profile-email" type="email" autoComplete="email" {...register("email")} />
          <FieldError>{formState.errors.email?.message}</FieldError>
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <UserRound className="size-4" />}
        Save profile
      </Button>
    </form>
  );
}

export function PasswordForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema) as Resolver<ChangePasswordValues>,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });
  const { register, formState, setError, reset } = form;

  function save(values: ChangePasswordValues) {
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(field as keyof ChangePasswordValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
        toast.error(result.error ?? "Could not change your password.");
        return;
      }
      toast.success("Password changed.");
      reset();
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(save)}
      noValidate
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="current-password">Current password *</Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            {...register("currentPassword")}
          />
          <FieldError>{formState.errors.currentPassword?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="new-password">New password *</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          <FieldError>{formState.errors.newPassword?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm new password *</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <FieldError>{formState.errors.confirmPassword?.message}</FieldError>
        </div>
      </div>
      <p className="text-xs text-ink-mute">
        Use at least 12 characters. Changing your password keeps you signed in.
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
        Change password
      </Button>
    </form>
  );
}
