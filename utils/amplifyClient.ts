import { AmplifyClient } from "@aws-sdk/client-amplify";

const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  // credentials: fromEnv(),
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY as string,
  },
});

export default amplifyClient;
