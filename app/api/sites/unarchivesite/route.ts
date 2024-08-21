import { NextRequest, NextResponse } from "next/server";
import Site from "@/models/Site";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import {
  AWSCreateApp,
} from "@/utils/awsClientFunctions";
import { CreateAppCommandInput, Platform } from "@aws-sdk/client-amplify";

connect();

const unarchiveSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site } = reqBody;

    const liveAppParams: CreateAppCommandInput = {
      name: `${site.title}`,
      oauthToken: process.env.GITHUB_OAUTH_TOKEN,
      platform: Platform.WEB_COMPUTE,
    };

    const testAppParams: CreateAppCommandInput = {
      name: `${site.title}-test`,
      oauthToken: process.env.GITHUB_OAUTH_TOKEN,
      platform: Platform.WEB_COMPUTE,
    };

    const liveAppResponse = await AWSCreateApp(liveAppParams);
    const testAppResponse = await AWSCreateApp(testAppParams);
    
    if (!liveAppResponse?.app) {
      throw new Error("Failed to create live app");
    }
    
    if (!testAppResponse?.app) {
      throw new Error("Failed to create test app");
    }
    
    const newLiveAppId = liveAppResponse.app.appId;
    const newTestAppId = testAppResponse.app.appId;

    await Site.findOneAndUpdate(
      { _id: site._id },
      {
        archived: false,
        appId: newLiveAppId,
        testAppId: newTestAppId,
      }
    );


    return NextResponse.json({
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(unarchiveSite);
