import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "regqjwlq",
  dataset: "production",
  apiVersion: "2025-10-22",
  useCdn: true
});
