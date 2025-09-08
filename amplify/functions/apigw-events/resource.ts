import { defineFunction } from "@aws-amplify/backend";

/**
 * Lambda that reads API Gateway **access logs** from CloudWatch Logs and emits normalized events.
 * LOG_GROUP_NAME must be provided via Amplify environment variables (per branch/stage).
 */
export const apigwEvents = defineFunction({
  name: "apigw-events",
  runtime: 20,          // Node.js 20
  timeoutSeconds: 10,
  // No secrets or values here; env is read in the handler via process.env.LOG_GROUP_NAME
});
