import { connect } from "@/lib/db";
import Site, { testSite } from "@/models/Site";
import {
  AmplifyClient,
  CreateAppCommand,
  Platform,
} from "@aws-sdk/client-amplify";
import { NextRequest, NextResponse } from "next/server";
import { fromEnv } from "@aws-sdk/credential-providers";

connect();

const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  // credentials: fromEnv(),
});
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title } = reqBody;

    const liveAppParams = {
      name: `${title}`,
      oauthToken: process.env.GITHUB_OAUTH_TOKEN,
      platform: Platform.WEB_COMPUTE,
    };

    const testAppParams = {
      name: `${title}-test`,
      oauthToken: process.env.GITHUB_OAUTH_TOKEN,
      platform: Platform.WEB_COMPUTE,
    };

    const createLiveAppCommand = new CreateAppCommand(liveAppParams);
    const liveAppResponse = await amplifyClient.send(createLiveAppCommand);
    const createTestAppCommand = new CreateAppCommand(testAppParams);
    const testAppResponse = await amplifyClient.send(createTestAppCommand);

    if (!liveAppResponse.app) {
      throw new Error("Failed to create live app");
    }

    if (!testAppResponse.app) {
      throw new Error("Failed to create test app");
    }

    const newLiveAppId = liveAppResponse.app.appId;
    const newTestAppId = testAppResponse.app.appId;

    const newSite = {
      ...testSite,
      title,
      appId: newLiveAppId,
      testAppId: newTestAppId,
    };

    const site = await Site.create(newSite);

    if (!site) {
      return NextResponse.json(
        { error: "Site creation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Site created",
      id: site._id,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
