"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettingsAction } from "@/server/actions/settings";
import type { SettingKey } from "@/server/services/settings";
import {
  brandSettingsSchema,
  contactSettingsSchema,
  homeSettingsSchema,
  seoSettingsSchema,
  socialSettingsSchema,
  type BrandSettings,
  type ContactSettings,
  type HomeSettings,
  type SeoSettings,
  type SocialSettings,
} from "@/server/validators/settings";

function useSectionSave(key: SettingKey) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function save(
    values: unknown,
    applyFieldErrors?: (field: string, message: string) => void,
  ) {
    startTransition(async () => {
      const result = await saveSettingsAction(key, values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              applyFieldErrors?.(field, messages[0]);
            }
          }
        }
        toast.error(result.error ?? "Could not save these settings.");
        return;
      }
      toast.success("Settings saved.");
      router.refresh();
    });
  }

  return { pending, save };
}

function SaveBar({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

export function BrandSettingsForm({ value }: { value: BrandSettings }) {
  const { pending, save } = useSectionSave("brand");
  const form = useForm<BrandSettings>({
    resolver: zodResolver(brandSettingsSchema) as Resolver<BrandSettings>,
    defaultValues: value,
    mode: "onBlur",
  });
  const { register, formState, setError } = form;

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        save(values, (field, message) =>
          setError(field as keyof BrandSettings, { type: "server", message }),
        ),
      )}
      noValidate
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="brandName">Business name *</Label>
          <Input id="brandName" autoComplete="organization" {...register("brandName")} />
          <FieldError>{formState.errors.brandName?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="wordmark">Wordmark *</Label>
          <Input id="wordmark" autoComplete="off" {...register("wordmark")} />
          <FieldError>{formState.errors.wordmark?.message}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" autoComplete="off" {...register("tagline")} />
        <FieldError>{formState.errors.tagline?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="description">Short description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
        <FieldError>{formState.errors.description?.message}</FieldError>
      </div>

      <SaveBar pending={pending} />
    </form>
  );
}

export function ContactSettingsForm({ value }: { value: ContactSettings }) {
  const { pending, save } = useSectionSave("contact");
  const form = useForm<ContactSettings>({
    resolver: zodResolver(contactSettingsSchema) as Resolver<ContactSettings>,
    defaultValues: value,
    mode: "onBlur",
  });
  const { register, formState, setError } = form;

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        save(values, (field, message) =>
          setError(field as keyof ContactSettings, { type: "server", message }),
        ),
      )}
      noValidate
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" autoComplete="email" {...register("email")} />
          <FieldError>{formState.errors.email?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone</Label>
          <Input id="contact-phone" type="tel" autoComplete="tel" {...register("phone")} />
          <FieldError>{formState.errors.phone?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-whatsapp">WhatsApp</Label>
          <Input id="contact-whatsapp" autoComplete="off" {...register("whatsapp")} />
          <FieldError>{formState.errors.whatsapp?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-address">Address</Label>
          <Input id="contact-address" autoComplete="street-address" {...register("address")} />
          <FieldError>{formState.errors.address?.message}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="contact-area">Service area</Label>
        <Input id="contact-area" autoComplete="off" {...register("serviceArea")} />
        <FieldError>{formState.errors.serviceArea?.message}</FieldError>
      </div>

      <SaveBar pending={pending} />
    </form>
  );
}

export function SeoSettingsForm({ value }: { value: SeoSettings }) {
  const { pending, save } = useSectionSave("seo");
  const form = useForm<SeoSettings>({
    resolver: zodResolver(seoSettingsSchema) as Resolver<SeoSettings>,
    defaultValues: value,
    mode: "onBlur",
  });
  const { register, formState, setError } = form;

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        save(values, (field, message) =>
          setError(field as keyof SeoSettings, { type: "server", message }),
        ),
      )}
      noValidate
      className="space-y-4"
    >
      <div>
        <Label htmlFor="seoTitle">Default page title</Label>
        <Input id="seoTitle" autoComplete="off" {...register("seoTitle")} />
        <p className="mt-1 text-xs text-ink-mute">
          Leave blank to use the business name and tagline.
        </p>
        <FieldError>{formState.errors.seoTitle?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="seoDescription">Meta description</Label>
        <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
        <FieldError>{formState.errors.seoDescription?.message}</FieldError>
      </div>

      <SaveBar pending={pending} />
    </form>
  );
}

export function HomeSettingsForm({ value }: { value: HomeSettings }) {
  const { pending, save } = useSectionSave("home");
  const form = useForm<HomeSettings>({
    resolver: zodResolver(homeSettingsSchema) as Resolver<HomeSettings>,
    defaultValues: value,
    mode: "onBlur",
  });
  const { register, formState, setError } = form;

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        save(values, (field, message) =>
          setError(field as keyof HomeSettings, { type: "server", message }),
        ),
      )}
      noValidate
      className="space-y-4"
    >
      <div>
        <Label htmlFor="heroEyebrow">Hero eyebrow</Label>
        <Input id="heroEyebrow" autoComplete="off" {...register("heroEyebrow")} />
        <FieldError>{formState.errors.heroEyebrow?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="heroTitle">Hero headline</Label>
        <Input id="heroTitle" autoComplete="off" {...register("heroTitle")} />
        <FieldError>{formState.errors.heroTitle?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="heroDescription">Hero supporting copy</Label>
        <Textarea id="heroDescription" rows={3} {...register("heroDescription")} />
        <FieldError>{formState.errors.heroDescription?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="studioTitle">Studio intro headline</Label>
        <Input id="studioTitle" autoComplete="off" {...register("studioTitle")} />
        <FieldError>{formState.errors.studioTitle?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="studioBody">Studio intro copy</Label>
        <Textarea id="studioBody" rows={4} {...register("studioBody")} />
        <FieldError>{formState.errors.studioBody?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="ctaTitle">Call-to-action headline</Label>
        <Input id="ctaTitle" autoComplete="off" {...register("ctaTitle")} />
        <FieldError>{formState.errors.ctaTitle?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="ctaDescription">Call-to-action copy</Label>
        <Textarea id="ctaDescription" rows={3} {...register("ctaDescription")} />
        <FieldError>{formState.errors.ctaDescription?.message}</FieldError>
      </div>

      <SaveBar pending={pending} />
    </form>
  );
}

export function SocialSettingsForm({ value }: { value: SocialSettings }) {
  const { pending, save } = useSectionSave("social");
  const form = useForm<SocialSettings>({
    resolver: zodResolver(socialSettingsSchema) as Resolver<SocialSettings>,
    defaultValues: value,
    mode: "onBlur",
  });
  const { control, register, formState, setError } = form;
  const fields = useFieldArray({ control, name: "social" });

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        save(values, (field, message) =>
          setError(field as `social.${number}.label`, { type: "server", message }),
        ),
      )}
      noValidate
      className="space-y-4"
    >
      <div className="space-y-4">
        {fields.fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-sm border border-line bg-ivory/50 p-4 sm:grid-cols-[10rem_1fr_10rem_auto]"
          >
            <div>
              <Label htmlFor={`${field.id}-label`}>Label</Label>
              <Input id={`${field.id}-label`} autoComplete="off" {...register(`social.${index}.label`)} />
              <FieldError>{formState.errors.social?.[index]?.label?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor={`${field.id}-href`}>URL</Label>
              <Input
                id={`${field.id}-href`}
                inputMode="url"
                autoComplete="off"
                placeholder="https://…"
                {...register(`social.${index}.href`)}
              />
              <FieldError>{formState.errors.social?.[index]?.href?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor={`${field.id}-icon`}>Icon</Label>
              <select
                id={`${field.id}-icon`}
                className="h-11 w-full rounded-sm border border-line bg-card px-3 text-sm text-ink focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                {...register(`social.${index}.icon`)}
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="pinterest">Pinterest</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <FieldError>{formState.errors.social?.[index]?.icon?.message}</FieldError>
            </div>
            <button
              type="button"
              onClick={() => fields.remove(index)}
              aria-label="Remove social link"
              className="mt-6 h-fit rounded-sm p-2 text-ink-mute transition-colors hover:bg-terracotta/10 hover:text-terracotta"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        {fields.fields.length === 0 ? (
          <p className="text-sm text-ink-mute">
            No social links yet — add one to show icons in the footer.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fields.append({ label: "", href: "", icon: "instagram" })}
        >
          <Plus className="size-4" />
          Add link
        </Button>
        <SaveBar pending={pending} />
      </div>
    </form>
  );
}
