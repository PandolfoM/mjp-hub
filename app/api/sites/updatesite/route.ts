import { NextRequest, NextResponse } from "next/server";
import {
  CreateBranchCommand,
  CreateDomainAssociationCommand,
  Stage,
  UpdateAppCommand,
} from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import amplifyClient from "@/utils/amplifyClient";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";

connect();

const updateSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site, form } = reqBody;

    const updateDB = await Site.findOneAndUpdate(
      { _id: site._id },
      {
        repo: form.repo,
        env: form.env,
        testURL: form.testURL,
        liveURL: form.liveURL,
      },
      { new: true }
    );

    const environmentVariables = form.env.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const updateTestParams = {
      appId: site.testAppId,
      repository: form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
    };

    const updateLiveParams = {
      appId: site.appId,
      repository: form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
    };

    const updateTestSite = new UpdateAppCommand(updateTestParams);
    const updateTestRes = await amplifyClient.send(updateTestSite);
    const updateLiveSite = new UpdateAppCommand(updateLiveParams);
    const updateLiveRes = await amplifyClient.send(updateLiveSite);

    if (!site.branchCreated) {
      try {
        const branchLiveParams = {
          appId: site.appId,
          branchName: "main",
          stage: Stage.PRODUCTION,
          enableAutoBuild: false,
          framework: "Next.js - SSR",
        };

        const createLiveBranchCommand = new CreateBranchCommand(
          branchLiveParams
        );
        await amplifyClient.send(createLiveBranchCommand);

        const branchTestParams = {
          appId: site.testAppId,
          branchName: "main",
          stage: Stage.PRODUCTION,
          enableAutoBuild: false,
          framework: "Next.js - SSR",
        };

        const createTestBranchCommand = new CreateBranchCommand(
          branchTestParams
        );
        await amplifyClient.send(createTestBranchCommand);

        await Site.findOneAndUpdate(
          { _id: site._id },
          {
            branchCreated: true,
          },
          { new: true }
        );
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    if (form.testURL !== site.testURL && form.testURL !== "") {
      const updateTestURL = new CreateDomainAssociationCommand({
        appId: site.testAppId,
        domainName: getDomainName(form.testURL),
        subDomainSettings: [
          {
            prefix: getSubDomain(form.testURL),
            branchName: "main",
          },
        ],
      });
      await amplifyClient.send(updateTestURL);
    }

    if (form.liveURL !== site.liveURL && form.liveURL !== "") {
      const updateLiveURL = new CreateDomainAssociationCommand({
        appId: site.appId,
        domainName: form.liveURL,
        subDomainSettings: [
          {
            prefix: "",
            branchName: "main",
          },
        ],
      });
      await amplifyClient.send(updateLiveURL);
    }

    return NextResponse.json({
      updateTest: updateTestRes,
      updateLive: updateLiveRes,
      site: updateDB,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

function getSubDomain(domain: string) {
  const parts = domain.split(".");
  if (parts.length < 3) {
    return domain; // If there are less than 3 parts, return the whole domain
  }
  return parts.slice(0, -2).join(".");
}

function getDomainName(domain: string) {
  const parts = domain.split(".");
  if (parts.length < 3) {
    return domain; // If there are less than 3 parts, return the whole domain
  }
  return parts.slice(-2).join(".");
}

export const POST = withAuth(updateSite);
