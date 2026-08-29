"use server";

import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { leadSchema } from "@/lib/formSchemas";
import { protectForm } from "@/lib/formGuard";
import { saveLeadBackup } from "@/lib/leadBackup";

export type LeadFormState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    name?: string[];
    phone?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitLead(data: {
  unitCode: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  website?: string;
  turnstileToken?: string;
  locale?: string;
}): Promise<LeadFormState> {
  const locale = hasLocale(routing.locales, data.locale)
    ? data.locale
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace: "lead" });

  const protection = await protectForm({
    honeypot: data.website,
    turnstileToken: data.turnstileToken,
  });

  if (!protection.ok) {
    if (protection.reason === "honeypot") {
      return {
        success: true,
        message: t("success", { code: data.unitCode }),
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

  const result = leadSchema({
    missingCode: t("missingCode"),
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

  const resend = new Resend(apiKey);

  const { unitCode, name, phone, email, message } = result.data;

  await saveLeadBackup({
    name,
    phone,
    email: email || "",
    project: unitCode,
    message,
    source: "unit",
  });

  const idempotencyKey = `lead/${unitCode}/${name}/${phone}`;

  try {
    const { data: salesData, error: salesError } = await resend.emails.send(
      {
        from: "Dumnica <onboarding@resend.dev>",
        to: [salesEmail],
        replyTo: email || undefined,
        subject: `Interesim për njësinë ${unitCode}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Interesim për njësi</h2>

              <p>
                <strong>Njësia:</strong> ${unitCode}
              </p>

              <p>
                <strong>Emri:</strong> ${name}
              </p>

              <p>
                <strong>Telefoni:</strong> ${phone}
              </p>

              <p>
                <strong>Email:</strong>
                ${email || "Nuk është dhënë"}
              </p>

              <hr />

              <h3>Mesazhi</h3>

              <p>
                ${message}
              </p>
            </div>
          `,
      },
      {
        idempotencyKey,
      },
    );

    if (salesError) {
      console.error("Resend sales email error:", salesError);

      return {
        success: false,
        message: t("sendFailed"),
      };
    }

    console.log("Sales email sent:", salesData?.id);

    if (email) {
      const { data: autoReplyData, error: autoReplyError } =
        await resend.emails.send(
          {
            from: "Dumnica <onboarding@resend.dev>",
            to: [email],
            subject: `Kërkesa juaj për njësinë ${unitCode}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Faleminderit për interesimin!</h2>

                <p>
                  Përshëndetje ${name},
                </p>

                <p>
                  Kemi pranuar kërkesën tuaj për njësinë
                  <strong>${unitCode}</strong>.
                </p>

                <p>
                  Ekipi ynë do t'ju kontaktojë së shpejti.
                </p>

                <hr />

                <p>
                  <strong>Njësia:</strong> ${unitCode}<br />
                  <strong>Telefoni:</strong> ${phone}
                </p>

                <p>
                  Faleminderit,<br />
                  Dumnica Group
                </p>
              </div>
            `,
          },
          {
            idempotencyKey: `${idempotencyKey}/auto-reply`,
          },
        );

      if (autoReplyError) {
        console.error("Resend auto-reply error:", autoReplyError);
      } else {
        console.log("Auto-reply sent:", autoReplyData?.id);
      }
    }

    return {
      success: true,
      message: t("success", { code: unitCode }),
    };
  } catch (error) {
    console.error("Lead submission error:", error);

    return {
      success: false,
      message: t("genericError"),
    };
  }
}
