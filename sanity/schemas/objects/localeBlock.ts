import { defineField, defineType } from "sanity";

const blockField = (name: "sq" | "en" | "de", title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "block" }],
  });

export default defineType({
  name: "localeBlock",
  title: "Localized rich text",
  type: "object",
  fields: [
    blockField("sq", "Shqip"),
    blockField("en", "English"),
    blockField("de", "Deutsch"),
  ],
});
