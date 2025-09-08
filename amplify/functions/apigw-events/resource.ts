import { defineFunction } from "@aws-amplify/backend";

/**
 * Lambda that reads API Gateway **access logs** from CloudWatch Logs and emits normalized events.
 * LOG_GROUP_NAME must be provided via Amplify environment variables (per branch/stage).
 */
export const apigwEvents = defineFunction({
  name: "apigw-events",
  runtime: 20,          // Node.js 20
  timeoutSeconds: 10,
  // Forward Amplify environment variable into the Lambda's environment
  environment: {
    LOG_GROUP_NAME: process.env.LOG_GROUP_NAME ?? "",
    EXEC_LOG_GROUP_NAME: process.env.EXEC_LOG_GROUP_NAME ?? "",
  },
});
