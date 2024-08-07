import { NextRequest, NextResponse } from "next/server";
import { JobType } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import { AWSStartJob } from "@/utils/awsClientFunctions";

connect();

const publishSite = async (req: NextRequest): Promise<NextResponse> => {
  const reqBody = await req.json();
  const { appId, message, type, user } = reqBody;

  try {
    const deployParams = {
      appId,
      branchName: "main",
      jobType: JobType.RELEASE,
      jobReason: message,
    };

    const startDeploymentRes = await AWSStartJob(deployParams);

    const newDeployment = {
      startTime: new Date(),
      title: message,
      type,
      jobId: startDeploymentRes?.jobSummary?.jobId,
      status: startDeploymentRes?.jobSummary?.status?.toLowerCase(),
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
};

export const POST = withAuth(publishSite);
