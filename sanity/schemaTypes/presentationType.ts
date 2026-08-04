import {defineField, defineType} from "sanity"
import {PresentationLinkInput} from "../components/PresentationLinkInput"

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
        "Kliknij „Generate”, aby utworzyć adres z nazwy klienta, np. maspex.",
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
    defineField({
      name: "presentationLink",
      title: "Link prezentacji",
      type: "string",
      readOnly: true,
      components: {input: PresentationLinkInput},
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
