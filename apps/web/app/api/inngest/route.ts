import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { reminder24hr, reminder2hr, reviewRequest, dailySummary } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reminder24hr, reminder2hr, reviewRequest, dailySummary],
});
