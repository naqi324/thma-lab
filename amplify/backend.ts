import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as iam from "aws-cdk-lib/aws-iam";
import { auth } from './auth/resource';
import { data } from './data/resource';
import { apigwEvents } from "./functions/apigw-events/resource";

const backend = defineBackend({
  // keep existing fields:
  auth,
  data,
  // add:
  apigwEvents,
});

const apiStack = backend.createStack("MonitorApiStack");

const integration = new HttpLambdaIntegration(
  "ApigwEventsIntegration",
  backend.apigwEvents.resources.lambda
);

const httpApi = new HttpApi(apiStack, "MonitorHttpApi", {
  apiName: "monitorApi",
  corsPreflight: {
    allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.OPTIONS],
    allowOrigins: ["*"],      // tighten later if desired
    allowHeaders: ["*"],
  },
  createDefaultStage: true,
});

httpApi.addRoutes({
  path: "/monitor/poll",
  methods: [HttpMethod.GET],
  integration,
});

// Read-only CloudWatch Logs permissions (tighten to your log group ARN if desired)
backend.apigwEvents.resources.lambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ["logs:FilterLogEvents", "logs:DescribeLogStreams", "logs:DescribeLogGroups"],
    resources: ["*"],
  })
);

// Publish the endpoint to amplify_outputs.json at custom.API.monitorApi.endpoint
backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});
