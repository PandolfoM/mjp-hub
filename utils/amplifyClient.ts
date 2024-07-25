import { AmplifyClient } from "@aws-sdk/client-amplify";
import { Route53Client } from "@aws-sdk/client-route-53";

export const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  // credentials: fromEnv(),
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY as string,
  },
});

export const route53Client = new Route53Client({
  region: "us-east-1",
  // credentials: fromEnv(),
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY as string,
  },
});
