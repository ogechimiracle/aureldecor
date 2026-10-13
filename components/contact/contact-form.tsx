"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  budgetOptions,
  contactFormDefaults,
  contactFormSchema,
  propertyTypeOptions,
  serviceOptions,
  type ContactFormValues,
} from "@/lib/schemas/contact";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  initialService?: string;
}

interface ApiResponse {
  ok: boolean;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export function ContactForm({ initialService }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      ...contactFormDefaults,
      service: (serviceOptions as readonly string[]).includes(
        initialService ?? "",
      )
        ? (initialService as ContactFormValues["service"])
        : contactFormDefaults.service,
    },
  });

  const descriptionValue = useWatch({ control, name: "description" }) ?? "";

  async function onSubmit(values: ContactFormValues) {
    if (submitting) return;
    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok) {
        if (data?.fieldErrors) {
          for (const [field, messages] of Object.entries(data.fieldErrors)) {
            if (messages && messages[0]) {
              setError(field as keyof ContactFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
          setServerError(
            data.message ??
              "Please review the highlighted fields and try again.",
          );
          return;
        }
        if (data?.code === "EMAIL_NOT_CONFIGURED") {
          setServerError(
            "Our contact form is not connected to an email service yet. Please email the studio directly — you'll find the address on this page.",
          );
          return;
        }
        setServerError(
          data?.message ??
            "Something went wrong sending your enquiry. Please try again.",
        );
        return;
      }

      toast.success(data?.message ?? "Thank you — your enquiry has been sent.");
      reset({ ...contactFormDefaults });
    } catch {
      setServerError(
        "We couldn't reach the server. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      {serverError ? (
        <div
          role="alert"
          className="rounded-sm border border-terracotta/40 bg-terracotta/5 px-4 py-3 text-sm text-terracotta-dark"
        >
          {serverError}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full name *</Label>
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          <FieldError>{errors.fullName?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">Email address *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            {...register("phone")}
          />
          <FieldError>{errors.phone?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="service">Service required *</Label>
          <Select
            id="service"
            aria-invalid={errors.service ? true : undefined}
            {...register("service")}
          >
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError>{errors.service?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="propertyType">Property type *</Label>
          <Select
            id="propertyType"
            aria-invalid={errors.propertyType ? true : undefined}
            {...register("propertyType")}
          >
            {propertyTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <FieldError>{errors.propertyType?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="projectLocation">Project location *</Label>
          <Input
            id="projectLocation"
            autoComplete="off"
            placeholder="City or area"
            aria-invalid={errors.projectLocation ? true : undefined}
            {...register("projectLocation")}
          />
          <FieldError>{errors.projectLocation?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="budget">Estimated budget</Label>
          <Select id="budget" {...register("budget")}>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="startDate">Preferred start date</Label>
          <Input
            id="startDate"
            type="text"
            placeholder="e.g. Spring 2026, or Q2"
            {...register("startDate")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">
          Project description *
          <span className="ml-2 font-normal normal-case tracking-normal text-ink-mute">
            {descriptionValue.length}/4000
          </span>
        </Label>
        <Textarea
          id="description"
          rows={6}
          maxLength={4000}
          placeholder="Tell us about the space, your goals, approximate rooms, and anything else we should know."
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
          {...register("description")}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </div>

      {/* Honeypot — invisible to humans, filled by bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("company")}
      />

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          aria-invalid={errors.consent ? true : undefined}
          className="mt-0.5 size-4 shrink-0 rounded-sm border border-line-strong accent-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          {...register("consent")}
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-ink-soft">
          I agree that my details will be used only to respond to this enquiry,
          and I have read the{" "}
          <Link href="/privacy" className="text-terracotta underline-offset-2 hover:underline">
            privacy notice
          </Link>
          . *
        </label>
      </div>
      <FieldError>{errors.consent?.message}</FieldError>

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-terracotta px-8 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-terracotta-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:pointer-events-none disabled:opacity-60",
        )}
      >
        {submitting ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-xs text-ink-mute">
        Fields marked * are required. We reply within two working days.
      </p>
    </form>
  );
}