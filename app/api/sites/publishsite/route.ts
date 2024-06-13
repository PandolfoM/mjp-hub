import { NextRequest, NextResponse } from "next/server";
import {
  AmplifyClient,
  CreateAppCommand,
  CreateBranchCommand,
  JobType,
  Platform,
  Stage,
  StartJobCommand,
} from "@aws-sdk/client-amplify";

const amplifyClient = new AmplifyClient({ region: "us-east-1" });

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { repo, env, name, appId, message, type } = req;

  if (!appId) {
    try {
      const appParams = {
        name: name,
        repository: repo,
        oauthToken: process.env.GITHUB_OAUTH_TOKEN,
        environmentVariables: env,
        platform: Platform.WEB,
        description: `Amplify app for ${name}`,
      };

      const createAppCommand = new CreateAppCommand(appParams);
      const appResponse = await amplifyClient.send(createAppCommand);

      if (!appResponse.app) {
        throw new Error("Failed to create app");
      }

      const newAppId = appResponse.app.appId;

      // Create the main branch
      const branchParams = {
        appId: newAppId,
        branchName: "main",
        stage: Stage.PRODUCTION,
        enableAutoBuild: false,
        framework: "Next.js - SSR",
      };

      const createBranchCommand = new CreateBranchCommand(branchParams);
      const branchResponse = await amplifyClient.send(createBranchCommand);

      // Deploy app
      const deployParams = {
        appId: newAppId,
        branchName: "main",
        jobType: JobType.RELEASE,
        jobReason: message,
      };

      const startDeployment = new StartJobCommand(deployParams);
      const deployResponse = await amplifyClient.send(startDeployment);

      return NextResponse.json({
        message: "App starting deployment",
        appId: newAppId,
        app: appResponse,
        branch: branchResponse,
        deployment: deployResponse,
      });
    } catch (e: any) {
      console.error("Error creating site and triggering deploy:", e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
