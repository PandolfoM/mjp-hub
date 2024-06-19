import { NextRequest, NextResponse } from "next/server";
import {
  AmplifyClient,
  JobType,
  StartJobCommand,
} from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import { fromEnv } from "@aws-sdk/credential-providers";

const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  credentials: fromEnv(),
});

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { appId, message, type } = req;

  try {
    const deployParams = {
      appId,
      branchName: "main",
      jobType: JobType.RELEASE,
      jobReason: message,
    };

    const startDeployment = new StartJobCommand(deployParams);
    await amplifyClient.send(startDeployment);

    const newDeployment = {
      date: new Date(),
      title: message,
      type,
    };

    const updatedSite = await Site.findOneAndUpdate(
      { appId: appId },
      { $push: { deployments: newDeployment } },
      { new: true, useFindAndModify: false }
    );

    return NextResponse.json({
      message: "App starting deployment",
      updatedSite,
    });
  } catch (e: any) {
    console.error("Error creating site and triggering deploy:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
