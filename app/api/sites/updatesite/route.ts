import { NextRequest, NextResponse } from "next/server";
import {
  CreateBranchCommand,
  CreateDomainAssociationCommand,
  DeleteDomainAssociationCommand,
  GetDomainAssociationCommand,
  Platform,
  Stage,
  UpdateAppCommand,
} from "@aws-sdk/client-amplify";
import {
  ChangeResourceRecordSetsCommand,
  CreateHostedZoneCommand,
  DeleteHostedZoneCommand,
  ListResourceRecordSetsCommand,
  RRType,
} from "@aws-sdk/client-route-53";
import Site from "@/models/Site";
import { amplifyClient, route53Client } from "@/utils/amplifyClient";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";

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

const updateSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site, form, frameworkLabel } = reqBody;

    const environmentVariables = form.env.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const updateTestParams = {
      appId: site.testAppId,
      repository: form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
      buildSpec: buildSpecReact,
      platform:
        form.framework === "react" ? Platform.WEB : Platform.WEB_COMPUTE,
    };

    const updateLiveParams = {
      appId: site.appId,
      repository: form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
      buildSpec: buildSpecReact,
      platform:
        form.framework === "react" ? Platform.WEB : Platform.WEB_COMPUTE,
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
          framework: frameworkLabel,
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
          framework: frameworkLabel,
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

    let nameServers = null;
    let zoneId = "";
    if (form.liveURL !== site.liveURL && form.liveURL !== "") {
      if (site.zoneId) {
        const getLiveUrl = new GetDomainAssociationCommand({
          appId: site.appId,
          domainName: site.liveURL,
        });
        const getLiveUrlRes = await amplifyClient.send(getLiveUrl);

        if (getLiveUrlRes.domainAssociation?.certificateVerificationDNSRecord) {
          const listRecords = new ListResourceRecordSetsCommand({
            HostedZoneId: site.zoneId,
            StartRecordName:
              getLiveUrlRes.domainAssociation?.certificateVerificationDNSRecord.split(
                " "
              )[0],
            StartRecordType: RRType.CNAME,
            MaxItems: 1,
          });
          const listRecordsRes = await route53Client.send(listRecords);

          if (listRecordsRes.ResourceRecordSets) {
            const deleteRecords = new ChangeResourceRecordSetsCommand({
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
            await route53Client.send(deleteRecords);
            const deleteHostedZone = new DeleteHostedZoneCommand({
              Id: site.zoneId,
            });
            await route53Client.send(deleteHostedZone);

            const deleteLiveUrl = new DeleteDomainAssociationCommand({
              appId: site.appId,
              domainName: site.liveURL,
            });
            await amplifyClient.send(deleteLiveUrl);
          }
        }
      }

      const createHostedZone = new CreateHostedZoneCommand({
        CallerReference: Date.now().toString(),
        Name: form.liveURL,
      });
      const hostedZoneRes = await route53Client.send(createHostedZone);

      if (hostedZoneRes.DelegationSet) {
        nameServers = hostedZoneRes.DelegationSet.NameServers;
      }
      if (hostedZoneRes.HostedZone?.Id) {
        zoneId = hostedZoneRes.HostedZone?.Id.replace("/hostedzone/", "");
      }

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
      hostedZoneRes.DelegationSet?.NameServers;
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
