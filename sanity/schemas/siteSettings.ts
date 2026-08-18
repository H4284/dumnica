import {defineType, defineField} from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  fields: [
    defineField({
      name: "phone",
      title: "Telefoni",
      type: "string",
      description: "Shkruani numrin kryesor të telefonit të kompanisë.",
      validation: (Rule) =>
        Rule.required().error("Numri i telefonit është i detyrueshëm."),
    }),

    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      description: "Shkruani numrin e WhatsApp-it për kontakt.",
      validation: (Rule) =>
        Rule.required().error("Numri i WhatsApp-it është i detyrueshëm."),
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Shkruani email adresën kryesore të kompanisë.",
      validation: (Rule) =>
        Rule.required().error("Email adresa është e detyrueshme."),
    }),

    defineField({
      name: "address",
      title: "Adresa",
      type: "string",
      description: "Shkruani adresën e kompanisë.",
      validation: (Rule) =>
        Rule.required().error("Adresa është e detyrueshme."),
    }),

    defineField({
      name: "socialLinks",
      title: "Rrjetet sociale",
      type: "object",
      description: "Shtoni linket e rrjeteve sociale të kompanisë.",
      fields: [
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
          description: "Vendosni linkun e Instagram-it.",
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
          description: "Vendosni linkun e Facebook-ut.",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
          description: "Vendosni linkun e LinkedIn-it.",
        }),
      ],
    }),

    defineField({
      name: "defaultShareImage",
      title: "Default Share Image",
      type: "image",
      description:
        "Ngarkoni fotografinë që përdoret kur një faqe shpërndahet në rrjete sociale.",
      options: {
        hotspot: true,
      },
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Konfigurimi kryesor i website-it",
      };
    },
  },
});