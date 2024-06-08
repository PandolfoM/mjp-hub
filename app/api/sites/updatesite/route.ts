import { NextRequest, NextResponse } from "next/server";
import { AmplifyClient, UpdateAppCommand } from "@aws-sdk/client-amplify";

const amplifyClient = new AmplifyClient({ region: "us-east-1" });

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { appId, repo, env } = reqBody;

    const updateParams = {
      appId,
      repository: repo,
      environmentVariables: env,
    };

    const updateSite = new UpdateAppCommand(updateParams);
    const updateResponse  = await amplifyClient.send(updateSite);

    return NextResponse.json(updateResponse); 
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
