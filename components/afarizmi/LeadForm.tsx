"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { submitLead } from "@/app/actions/submitLead";
import { trackSiteEvent } from "@/components/analytics/trackEvent";
import HoneypotField from "@/components/forms/HoneypotField";
import TurnstileWidget from "@/components/forms/TurnstileWidget";
import { leadSchema } from "@/lib/formSchemas";

type Props = {
  unitCode: string;
  onClose: () => void;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
  website: string;
};

export default function LeadForm({ unitCode, onClose }: Props) {
  const t = useTranslations("lead");
  const locale = useLocale();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: t("defaultMessage", { code: unitCode }),
    website: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsed = leadSchema({
      missingCode: t("missingCode"),
      nameRequired: t("nameRequired"),
      phoneRequired: t("phoneRequired"),
      emailInvalid: t("emailInvalid"),
      messageShort: t("messageShort"),
    }).safeParse({ ...form, unitCode });

    if (!parsed.success) {
      const firstFieldError =
        parsed.error.flatten().fieldErrors.name?.[0] ??
        parsed.error.flatten().fieldErrors.phone?.[0] ??
        parsed.error.flatten().fieldErrors.email?.[0] ??
        parsed.error.flatten().fieldErrors.message?.[0];
      setError(firstFieldError ?? t("checkFields"));
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await submitLead({
        unitCode,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        website: form.website,
        turnstileToken,
        locale,
      });

      if (!result.success) {
        const firstFieldError =
          result.fieldErrors?.name?.[0] ??
          result.fieldErrors?.phone?.[0] ??
          result.fieldErrors?.email?.[0] ??
          result.fieldErrors?.message?.[0];

        setError(firstFieldError ?? result.message);
        return;
      }

      setSuccess(true);
      trackSiteEvent("form_submit");
    } catch {
      setError(t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800">
          {t("thanks")}
        </h3>

        <p className="mt-2 text-sm text-green-700">
          {t("success", { code: unitCode })}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          {t("close")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>
      <HoneypotField
        label={t("honeypot")}
        value={form.website}
        onChange={(value) =>
          setForm((current) => ({ ...current, website: value }))
        }
      />
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">
          {t("title", { code: unitCode })}
        </h3>

        <p className="mt-1 text-sm text-secondary">{t("hint")}</p>
      </div>

      <div>
        <label
          htmlFor="lead-name"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          {t("name")}
        </label>

        <input
          id="lead-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-primary outline-none transition placeholder:text-secondary focus:border-primary"
          placeholder={t("namePlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="lead-phone"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          {t("phone")}
        </label>

        <input
          id="lead-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          autoComplete="tel"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-primary outline-none transition placeholder:text-secondary focus:border-primary"
          placeholder={t("phonePlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="lead-email"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          {t("email")}{" "}
          <span className="text-secondary">{t("optional")}</span>
        </label>

        <input
          id="lead-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-primary outline-none transition placeholder:text-secondary focus:border-primary"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="lead-message"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          {t("message")}
        </label>

        <textarea
          id="lead-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-primary outline-none transition placeholder:text-secondary focus:border-primary"
        />
      </div>

      <TurnstileWidget onToken={handleToken} />

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
