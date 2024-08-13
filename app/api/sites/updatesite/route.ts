import { NextRequest, NextResponse } from "next/server";
import { Platform, Stage, UpdateAppCommandInput } from "@aws-sdk/client-amplify";
import { RRType } from "@aws-sdk/client-route-53";
import Site from "@/models/Site";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import {
  AWSChangeRecords,
  AWSCreateBranch,
  AWSCreateDomain,
  AWSCreateHostedZone,
  AWSDeleteDomain,
  AWSDeleteHostedZone,
  AWSGetDomain,
  AWSListRecords,
  AWSUpdateApp,
} from "@/utils/awsClientFunctions";

connect();

const buildSpecReact = `
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*
`;

const buildSpecNext = `
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*
`;

const updateSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site, form, frameworkLabel } = reqBody;

    const environmentVariables = form.env.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const updateTestParams: UpdateAppCommandInput = {
      appId: site.testAppId,
      repository: form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
      buildSpec: form.framework === "react" ? buildSpecReact : buildSpecNext,
      platform:
        form.framework === "react" ? Platform.WEB : Platform.WEB_COMPUTE,
    };

    const updateLiveParams: UpdateAppCommandInput = {
      appId: site.appId,
      repository: form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
      buildSpec: form.framework === "react" ? buildSpecReact : buildSpecNext,
      platform:
        form.framework === "react" ? Platform.WEB : Platform.WEB_COMPUTE,
    };

    const updateTestRes = await AWSUpdateApp(updateTestParams);
    const updateLiveRes = await AWSUpdateApp(updateLiveParams);

    if (!site.branchCreated) {
      try {
        const branchLiveParams = {
          appId: site.appId,
          branchName: "main",
          stage: Stage.PRODUCTION,
          enableAutoBuild: false,
          framework: frameworkLabel,
        };

        await AWSCreateBranch(branchLiveParams);

        const branchTestParams = {
          appId: site.testAppId,
          branchName: "main",
          stage: Stage.PRODUCTION,
          enableAutoBuild: false,
          framework: frameworkLabel,
        };

        await AWSCreateBranch(branchTestParams);

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
      const domain = await AWSGetDomain({
        appId: site.testAppId,
        domainName: "mjphub.com",
      });

      if (domain) {
        await AWSDeleteDomain({
          appId: site.testAppId,
          domainName: "mjphub.com",
        });
      }

      await AWSCreateDomain({
        appId: site.testAppId,
        domainName: getDomainName(form.testURL),
        subDomainSettings: [
          {
            prefix: getSubDomain(form.testURL),
            branchName: "main",
          },
        ],
      });
    }

    let nameServers = null;
    let zoneId = "";
    if (form.liveURL !== site.liveURL && form.liveURL !== "") {
      if (site.zoneId) {
        const getLiveUrlRes = await AWSGetDomain({
          appId: site.appId,
          domainName: site.liveURL,
        });

        if (
          getLiveUrlRes?.domainAssociation?.certificateVerificationDNSRecord
        ) {
          const listRecordsRes = await AWSListRecords({
            HostedZoneId: site.zoneId,
            StartRecordName:
              getLiveUrlRes.domainAssociation?.certificateVerificationDNSRecord.split(
                " "
              )[0],
            StartRecordType: RRType.CNAME,
            MaxItems: 1,
          });

          if (listRecordsRes?.ResourceRecordSets) {
            await AWSChangeRecords({
              HostedZoneId: site.zoneId,
              ChangeBatch: {
                Changes: [
                  {
                    Action: "DELETE",
                    ResourceRecordSet: {
                      Name: getLiveUrlRes.domainAssociation?.certificateVerificationDNSRecord.split(
                        " "
                      )[0],
                      Type: RRType.CNAME,
                      TTL: listRecordsRes.ResourceRecordSets[0].TTL,
                      ResourceRecords:
                        listRecordsRes.ResourceRecordSets[0].ResourceRecords,
                    },
                  },
                ],
              },
            });

            await AWSDeleteHostedZone({
              Id: site.zoneId,
            });

            await AWSDeleteDomain({
              appId: site.appId,
              domainName: site.liveURL,
            });
          }
        }
      }

      const hostedZoneRes = await AWSCreateHostedZone({
        CallerReference: Date.now().toString(),
        Name: form.liveURL,
      });

      if (hostedZoneRes?.DelegationSet) {
        nameServers = hostedZoneRes.DelegationSet.NameServers;
      }
      if (hostedZoneRes?.HostedZone?.Id) {
        zoneId = hostedZoneRes.HostedZone?.Id.replace("/hostedzone/", "");
      }

      await AWSCreateDomain({
        appId: site.appId,
        domainName: form.liveURL,
        subDomainSettings: [
          {
            prefix: "",
            branchName: "main",
          },
        ],
      });
    }

    const updateDB = await Site.findOneAndUpdate(
      { _id: site._id },
      {
        repo: form.repo,
        env: form.env,
        testURL: form.testURL,
        liveURL: form.liveURL,
        framework: form.framework,
        zoneId,
      },
      { new: true }
    );

    return NextResponse.json({
      updateTest: updateTestRes,
      updateLive: updateLiveRes,
      site: updateDB,
      nameServers,
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
