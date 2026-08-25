"use server";

import { z } from "zod";
import { Resend } from "resend";

const leadSchema = z.object({
  unitCode: z.string().trim().min(1, "Kodi i njësisë mungon."),

  name: z
    .string()
    .trim()
    .min(2, "Ju lutem shkruani emrin tuaj."),

  phone: z
    .string()
    .trim()
    .min(8, "Ju lutem shkruani një numër telefoni."),

  email: z
    .string()
    .trim()
    .email("Email-i nuk është valid.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(5, "Mesazhi është shumë i shkurtër."),
});

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
}): Promise<LeadFormState> {
  // 1. Validate on the server
  const result = leadSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Ju lutem kontrolloni të dhënat e plotësuara.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  // 2. Check Resend configuration
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is missing.");

    return {
      success: false,
      message: "Shërbimi i email-it nuk është konfiguruar.",
    };
  }

  const resend = new Resend(apiKey);

  const {
    unitCode,
    name,
    phone,
    email,
    message,
  } = result.data;

  /*
   * One stable key for this exact lead.
   *
   * The browser already prevents double-clicks, but this gives us
   * a second layer of protection on the email API side.
   */
  const idempotencyKey = `lead/${unitCode}/${name}/${phone}`;

  try {
    // 3. Send lead to sales
    const { data: salesData, error: salesError } =
      await resend.emails.send(
        {
          from: "Dumnica <onboarding@resend.dev>",
          to: ["havajusufi05@gmail.com"],
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
        message:
          "Nuk mundëm ta dërgojmë kërkesën. Ju lutem provoni përsëri.",
      };
    }

    console.log("Sales email sent:", salesData?.id);

    // 4. Send auto-reply only when visitor provided an email
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
        /*
         * Sales email was already sent successfully.
         * Do not tell the visitor that the whole lead failed.
         * Log the auto-reply error for debugging.
         */
        console.error(
          "Resend auto-reply error:",
          autoReplyError,
        );
      } else {
        console.log(
          "Auto-reply sent:",
          autoReplyData?.id,
        );
      }
    }

    // 5. Everything required succeeded
    return {
      success: true,
      message: "Kërkesa u dërgua me sukses.",
    };
  } catch (error) {
    console.error("Lead submission error:", error);

    return {
      success: false,
      message:
        "Diçka shkoi keq. Ju lutem provoni përsëri.",
    };
  }
}