import { defineField, defineType } from "sanity";

export default defineType({
  name: "unit",
  title: "Unit",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Kodi",
      type: "string",
      description: "P.sh. A-3-12.",
      validation: (Rule) =>
        Rule.required()
          .error("Kodi i njësisë është i detyrueshëm.")
          .custom(async (value, context) => {
            if (!value) return true;

            const client = context.getClient({
              apiVersion: "2025-01-01",
            });

            const id = context.document?._id?.replace(/^drafts\./, "");

            const count = await client.fetch(
              `count(*[
                _type == "unit" &&
                code == $code &&
                !(_id in [$id, "drafts." + $id])
              ])`,
              {
                code: value,
                id,
              },
            );

            return count === 0 || "Ky kod i njësisë ekziston tashmë.";
          }),
    }),

    defineField({
      name: "building",
      title: "Building",
      type: "reference",
      to: [{ type: "building" }],
      validation: (Rule) =>
        Rule.required().error("Building është i detyrueshëm."),
    }),

    defineField({
      name: "floor",
      title: "Kati",
      type: "number",
      validation: (Rule) =>
        Rule.required().integer().error("Kati është i detyrueshëm."),
    }),

    defineField({
      name: "unitType",
      title: "Lloji i njësisë",
      type: "string",
      options: {
        list: [
          { title: "Banesor", value: "banesor" },
          { title: "Afarist", value: "afarist" },
        ],
      },
      validation: (Rule) =>
        Rule.required().error("Lloji i njësisë është i detyrueshëm."),
    }),

    defineField({
      name: "rooms",
      title: "Dhoma",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: "areaNet",
      title: "Sipërfaqja neto (m²)",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .positive()
          .error("Sipërfaqja neto duhet të jetë më e madhe se 0."),
    }),

    defineField({
      name: "areaGross",
      title: "Sipërfaqja bruto (m²)",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .positive()
          .error("Sipërfaqja bruto duhet të jetë më e madhe se 0."),
    }),

    defineField({
      name: "orientation",
      title: "Orientimi",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "V", value: "V" },
          { title: "L", value: "L" },
          { title: "J", value: "J" },
          { title: "P", value: "P" },
        ],
      },
    }),

    defineField({
      name: "status",
      title: "Statusi",
      type: "string",
      options: {
        list: [
          { title: "I lirë", value: "i_lire" },
          { title: "I rezervuar", value: "i_rezervuar" },
          { title: "I shitur", value: "i_shitur" },
        ],
      },
      initialValue: "i_lire",
      validation: (Rule) =>
        Rule.required().error("Statusi është i detyrueshëm."),
    }),

    defineField({
      name: "svgPath",
      title: "SVG Path",
      type: "text",
      description:
        "Paste the SVG path from the polygon tool. Do not edit by hand.",
      rows: 4,
    }),

    defineField({
      name: "floorPlanImage",
      title: "Planimetria",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "floorPlanPdf",
      title: "PDF e planimetrisë",
      type: "file",
      options: {
        accept: ".pdf",
      },
      description:
        "Opsionale. PDF-ja e planimetrisë specifike për këtë njësi.",
    }),

    defineField({
      name: "price",
      title: "Çmimi",
      type: "number",
      description:
        "Opsionale. Nëse lihet bosh, në website shfaqet “Çmimi me kërkesë”.",
      validation: (Rule) => Rule.min(0),
    }),
  ],

  preview: {
    select: {
      code: "code",
      floor: "floor",
      areaNet: "areaNet",
      status: "status",
    },
    prepare({ code, floor, areaNet, status }) {
      return {
        title: code || "Untitled",
        subtitle: `Kati ${floor ?? "-"} — ${areaNet ?? "-"} m² — ${status ?? "-"}`,
      };
    },
  },
});