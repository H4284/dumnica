"use server";

import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { contactSchema } from "@/lib/formSchemas";
import { protectForm } from "@/lib/formGuard";
import { saveLeadBackup } from "@/lib/leadBackup";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export type ContactFormState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    phone?: string[];
    email?: string[];
    project?: string[];
    message?: string[];
  };
};

export async function submitContact(data: {
  name: string;
  phone: string;
  email: string;
  project: string;
  message: string;
  website?: string;
  turnstileToken?: string;
  locale?: string;
}): Promise<ContactFormState> {
  const locale = hasLocale(routing.locales, data.locale)
    ? data.locale
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace: "contactForm" });

  const protection = await protectForm({
    honeypot: data.website,
    turnstileToken: data.turnstileToken,
  });

  if (!protection.ok) {
    if (protection.reason === "honeypot") {
      return {
        success: true,
        message: t("success"),
      };
    }

    return {
      success: false,
      message:
        protection.reason === "rate_limit"
          ? t("rateLimited")
          : t("turnstileFailed"),
    };
  }

  const result = contactSchema({
    nameRequired: t("nameRequired"),
    phoneRequired: t("phoneRequired"),
    emailInvalid: t("emailInvalid"),
    messageShort: t("messageShort"),
  }).safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: t("checkFields"),
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const salesEmail =
    process.env.SALES_EMAIL?.trim() || "havajusufi05@gmail.com";

  if (!apiKey) {
    console.error("RESEND_API_KEY is missing.");
    return {
      success: false,
      message: t("notConfigured"),
    };
  }

  const { name, phone, email, project, message } = result.data;
  const projectLabel = project || t("noProject");

  await saveLeadBackup({
    name,
    phone,
    email: email || "",
    project: projectLabel,
    message,
    source: "contact",
  });

  const resend = new Resend(apiKey);
  const idempotencyKey = `contact/${name}/${phone}/${message.slice(0, 40)}`;

  try {
    const { error: salesError } = await resend.emails.send(
      {
        from: "Dumnica <onboarding@resend.dev>",
        to: [salesEmail],
        replyTo: email || undefined,
        subject: `Mesazh nga forma e kontaktit${project ? ` — ${project}` : ""}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Mesazh i ri nga website</h2>
            <p><strong>Emri:</strong> ${escapeHtml(name)}</p>
            <p><strong>Telefoni:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email || t("emailMissing"))}</p>
            <p><strong>Projekti:</strong> ${escapeHtml(projectLabel)}</p>
            <hr />
            <h3>Mesazhi</h3>
            <p>${escapeHtml(message)}</p>
          </div>
        `,
      },
      { idempotencyKey },
    );

    if (salesError) {
      console.error("Resend sales email error:", salesError);
      return {
        success: false,
        message: t("sendFailed"),
      };
    }

    if (email) {
      const { error: autoReplyError } = await resend.emails.send(
        {
          from: "Dumnica <onboarding@resend.dev>",
          to: [email],
          subject: t("autoReplySubject"),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>${t("autoReplyHeading")}</h2>
              <p>${t("autoReplyHello", { name: escapeHtml(name) })}</p>
              <p>${t("autoReplyBody")}</p>
              <p>${t("autoReplySignoff")}<br />Dumnica Group</p>
            </div>
          `,
        },
        { idempotencyKey: `${idempotencyKey}/auto-reply` },
      );

      if (autoReplyError) {
        console.error("Resend auto-reply error:", autoReplyError);
      }
    }

    return {
      success: true,
      message: t("success"),
    };
  } catch (error) {
    console.error("Contact submission error:", error);
    return {
      success: false,
      message: t("genericError"),
    };
  }
}
