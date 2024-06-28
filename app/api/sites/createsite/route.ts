import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Site, { testSite } from "@/models/Site";
import amplifyClient from "@/utils/amplifyClient";
import { CreateAppCommand, Platform } from "@aws-sdk/client-amplify";
import { NextRequest, NextResponse } from "next/server";

connect();

const createSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
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
};

export const POST = withAuth(createSite);
