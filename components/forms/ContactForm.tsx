"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { submitContact } from "@/lib/actions/contact";
import { contactSchema } from "@/lib/formSchemas";
import { trackSiteEvent } from "@/components/analytics/trackEvent";
import HoneypotField from "@/components/forms/HoneypotField";
import TurnstileWidget from "@/components/forms/TurnstileWidget";

type ProjectOption = {
  slug: string;
  title: string;
};

type ContactFormProps = {
  projects: ProjectOption[];
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
  website: string;
};

export default function ContactForm({ projects }: ContactFormProps) {
  const t = useTranslations("contactForm");
  const locale = useLocale();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    project: "",
    message: "",
    website: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsed = contactSchema({
      nameRequired: t("nameRequired"),
      phoneRequired: t("phoneRequired"),
      emailInvalid: t("emailInvalid"),
      messageShort: t("messageShort"),
    }).safeParse(form);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setError(t("checkFields"));
      return;
    }

    setFieldErrors({});
    setError("");
    setIsSubmitting(true);

    try {
      const result = await submitContact({
        ...form,
        turnstileToken,
        locale,
      });

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setError(result.message);
        return;
      }

      setSuccess(result.message);
      trackSiteEvent("form_submit");
    } catch {
      setError(t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-green-50 p-6" role="status">
        <h2 className="text-lg font-semibold text-green-800">{t("thanks")}</h2>
        <p className="mt-2 text-sm text-green-700">{success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>
      <HoneypotField
        label={t("honeypot")}
        value={form.website}
        onChange={(value) => setForm((current) => ({ ...current, website: value }))}
      />

      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
          {t("name")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          className="field-input"
        />
        {fieldErrors.name?.[0] && (
          <p className="mt-1 text-sm text-red-700">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium">
          {t("phone")}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          autoComplete="tel"
          className="field-input"
        />
        {fieldErrors.phone?.[0] && (
          <p className="mt-1 text-sm text-red-700">{fieldErrors.phone[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
          {t("email")} <span className="text-secondary">{t("optional")}</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className="field-input"
        />
        {fieldErrors.email?.[0] && (
          <p className="mt-1 text-sm text-red-700">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-project" className="mb-1.5 block text-sm font-medium">
          {t("project")}
        </label>
        <select
          id="contact-project"
          name="project"
          value={form.project}
          onChange={handleChange}
          className="field-select"
        >
          <option value="">{t("projectPlaceholder")}</option>
          {projects.map((project) => (
            <option key={project.slug} value={project.title}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="field-textarea"
        />
        {fieldErrors.message?.[0] && (
          <p className="mt-1 text-sm text-red-700">{fieldErrors.message[0]}</p>
        )}
      </div>

      <TurnstileWidget onToken={handleToken} />

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
