import { NextRequest, NextResponse } from "next/server";
import { GetJobCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import { amplifyClient } from "@/utils/amplifyClient";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";

connect();

const getDeployments = async (req: NextRequest): Promise<NextResponse> => {
  const reqBody = await req.json();
  const { siteId, appId, testAppId } = reqBody;

  try {
    const deploymentsRes = await Site.findById(siteId);
    const deployments = deploymentsRes.deployments;
    const newDeployments = [];

    for (let i = 0; i < deployments.length; i++) {
      const deploy = deployments[i];

      const getJob = new GetJobCommand({
        appId: deploy.type === "test" ? testAppId : appId,
        jobId: deploy.jobId,
        branchName: "main",
      });
      const getJobRes = await amplifyClient.send(getJob);

      if (deploy.status !== "succeed") {
        await Site.findOneAndUpdate(
          { _id: siteId, "deployments._id": deploy._id },
          {
            $set: {
              "deployments.$.endTime": getJobRes.job?.summary?.endTime,
              "deployments.$.status":
                getJobRes.job?.summary?.status?.toLowerCase(),
            },
          },
          { new: true }
        );

        const updatedSite = await Site.findOne(
          { _id: siteId, "deployments._id": deploy._id },
          { "deployments.$": 1 }
        );
        const updatedDeployment = updatedSite?.deployments?.[0];
        newDeployments.push(updatedDeployment);
      } else {
        newDeployments.push(deploy);
      }
    }

    return NextResponse.json({
      success: true,
      deployments: newDeployments,
    });
  } catch (error: any) {
    console.error("Error getting deployments:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = withAuth(getDeployments);
