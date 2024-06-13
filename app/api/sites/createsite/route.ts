import { connect } from "@/lib/db";
import Site, { testSite } from "@/models/Site";
import {
  AmplifyClient,
  CreateAppCommand,
  CreateBranchCommand,
  Platform,
  Stage,
} from "@aws-sdk/client-amplify";
import { NextRequest, NextResponse } from "next/server";
import { fromEnv } from "@aws-sdk/credential-providers";

connect();

const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  credentials: fromEnv(),
});
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { title } = reqBody;

    const appParams = {
      name: title,
      oauthToken: process.env.GITHUB_OAUTH_TOKEN,
      platform: Platform.WEB,
    };

    const createAppCommand = new CreateAppCommand(appParams);
    const appResponse = await amplifyClient.send(createAppCommand);

    if (!appResponse.app) {
      throw new Error("Failed to create app");
    }

    const newAppId = appResponse.app.appId;

    const branchParams = {
      appId: newAppId,
      branchName: "main",
      stage: Stage.PRODUCTION,
      enableAutoBuild: false,
      framework: "Next.js - SSR",
    };

    const createBranchCommand = new CreateBranchCommand(branchParams);
    await amplifyClient.send(createBranchCommand);

    const newSite = {
      ...testSite,
      title,
      appId: newAppId,
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
