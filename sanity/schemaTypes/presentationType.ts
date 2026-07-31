import {defineField, defineType} from "sanity"

export const presentationType = defineType({
  name: "presentation",
  title: "Prezentacja",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nazwa prezentacji",
      type: "string",
      description: "Nazwa widoczna w panelu, np. Prezentacja dla marki X.",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Adres prezentacji",
      type: "slug",
      description:
        "Kliknij „Generate”, aby utworzyć adres z nazwy klienta, np. prezentacja-maspex.html.",
      options: {source: "clientName", maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "clientName",
      title: "Nazwa klienta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "presentationDate",
      title: "Data prezentacji",
      type: "date",
      options: {dateFormat: "DD.MM.YYYY"},
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Najnowsze prezentacje",
      name: "presentationDateDesc",
      by: [{field: "presentationDate", direction: "desc"}],
    },
  ],
  preview: {
    select: {
      title: "clientName",
      date: "presentationDate",
      subtitle: "title",
    },
    prepare({title, date, subtitle}) {
      return {
        title: title || "Prezentacja bez klienta",
        subtitle: [date, subtitle].filter(Boolean).join(" - "),
      }
    },
  },
})
