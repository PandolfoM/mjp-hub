import { NextRequest, NextResponse } from "next/server";
import {
  CreateBranchCommand,
  CreateDomainAssociationCommand,
  Stage,
  UpdateAppCommand,
} from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import amplifyClient from "@/utils/amplifyClient";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const updateDB = await Site.findOneAndUpdate(
      { _id: req.site._id },
      {
        repo: req.form.repo,
        env: req.form.env,
        testURL: req.form.testURL,
        liveURL: req.form.liveURL,
      },
      { new: true }
    );

    const environmentVariables = req.form.env.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const updateTestParams = {
      appId: req.site.testAppId,
      repository: req.form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
    };

    const updateLiveParams = {
      appId: req.site.appId,
      repository: req.form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
    };

    const updateTestSite = new UpdateAppCommand(updateTestParams);
    const updateTestRes = await amplifyClient.send(updateTestSite);
    const updateLiveSite = new UpdateAppCommand(updateLiveParams);
    const updateLiveRes = await amplifyClient.send(updateLiveSite);

    if (!req.site.branchCreated) {
      try {
        const branchLiveParams = {
          appId: req.site.appId,
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
          appId: req.site.testAppId,
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
          { _id: req.site._id },
          {
            branchCreated: true,
          },
          { new: true }
        );
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    if (req.form.testURL !== req.site.testURL && req.form.testURL !== "") {
      const updateTestURL = new CreateDomainAssociationCommand({
        appId: req.site.testAppId,
        domainName: getDomainName(req.form.testURL),
        subDomainSettings: [
          {
            prefix: getSubDomain(req.form.testURL),
            branchName: "main",
          },
        ],
      });
      await amplifyClient.send(updateTestURL);
    }

    if (req.form.liveURL !== req.site.liveURL && req.form.liveURL !== "") {
      const updateLiveURL = new CreateDomainAssociationCommand({
        appId: req.site.appId,
        domainName: req.form.liveURL,
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
}

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
