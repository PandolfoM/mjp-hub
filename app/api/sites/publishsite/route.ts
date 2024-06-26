import { NextRequest, NextResponse } from "next/server";
import { JobType, StartJobCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import amplifyClient from "@/utils/amplifyClient";
import { connect } from "@/lib/db";

connect();

export async function POST(request: NextRequest) {
  const req = await request.json();
  const { appId, message, type, user } = req;

  try {
    const deployParams = {
      appId,
      branchName: "main",
      jobType: JobType.RELEASE,
      jobReason: message,
    };

    const startDeployment = new StartJobCommand(deployParams);
    const startDeploymentRes = await amplifyClient.send(startDeployment);

    const newDeployment = {
      startTime: new Date(),
      title: message,
      type,
      jobId: startDeploymentRes.jobSummary?.jobId,
      status: startDeploymentRes.jobSummary?.status?.toLowerCase(),
      deployedBy: user.email,
    };

    const updatedSite = await Site.findOneAndUpdate(
      {
        $or: [{ appId: appId }, { testAppId: appId }],
      },
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
