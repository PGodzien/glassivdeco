import {createClient} from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-07-25",
      useCdn: true,
    })
  : null
