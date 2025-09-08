
# API Gateway Live Monitor (lightweight)
This adds a tiny Function + HTTP route + React widget that shows near-real-time API calls at the bottom of the guide.

## One-time setup
1. In API Gateway (REST API) Stage, enable **Access logging** to a CloudWatch Logs **log group** in **JSON** format.
2. Use a safe JSON access-log format, e.g.:
   {"requestId":"$context.requestId","requestTimeEpoch":$context.requestTimeEpoch,"ip":"$context.identity.sourceIp","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","path":"$context.path","status":$context.status,"responseLatency":$context.responseLatency,"integrationStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","responseLength":$context.responseLength}
3. In Amplify env vars, set `LOG_GROUP_NAME` to that log group name (not the ARN), e.g. `/aws/apigw/mock-biomed-api-access`.

## Dev run
- `npx ampx sandbox` (provisions the Lambda + HTTP API; outputs to `amplify_outputs.json`)
- `npm run dev` (Vite at http://localhost:5173)
- Hit your API; the monitor auto-updates within ~2s.

## Security
- No API keys or gateway hostnames are ever sent to the browser.
- The Lambda reads CloudWatch logs via IAM; the UI only calls `/monitor/poll`.
- Redaction guards ensure tokens/emails aren’t displayed.

