"use client";

import { useState } from "react";

import { submitLead } from "@/app/actions/submitLead";

type Props = {
  unitCode: string;
  onClose: () => void;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function LeadForm({ unitCode, onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    message: `Përshëndetje, jam i interesuar për njësinë ${unitCode}.`,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setError("");
    setIsSubmitting(true);

    try {
      const result = await submitLead({
        unitCode,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
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
    } catch {
      setError("Diçka shkoi keq. Ju lutem provoni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800">
          Faleminderit!
        </h3>

        <p className="mt-2 text-sm text-green-700">
          Kërkesa juaj për njësinë {unitCode} u dërgua me sukses.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Mbyll
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">
          Interesohem për {unitCode}
        </h3>

        <p className="mt-1 text-sm text-secondary">
          Plotësoni të dhënat tuaja dhe do t&apos;ju kontaktojmë.
        </p>
      </div>

      <div>
        <label
          htmlFor="lead-name"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          Emri
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
          placeholder="Emri dhe mbiemri"
        />
      </div>

      <div>
        <label
          htmlFor="lead-phone"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          Telefoni
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
          placeholder="+383 44 123 456"
        />
      </div>

      <div>
        <label
          htmlFor="lead-email"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          Email{" "}
          <span className="text-secondary">(opsionale)</span>
        </label>

        <input
          id="lead-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-primary outline-none transition placeholder:text-secondary focus:border-primary"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="lead-message"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          Mesazhi
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
        {isSubmitting ? "Duke dërguar..." : "Dërgo kërkesën"}
      </button>
    </form>
  );
}