import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "1dvwbj0v",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
