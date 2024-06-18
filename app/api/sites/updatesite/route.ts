import { NextRequest, NextResponse } from "next/server";
import { AmplifyClient, UpdateAppCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import { fromEnv } from "@aws-sdk/credential-providers";

const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  credentials: fromEnv(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const updateDB = await Site.findOneAndUpdate(
      { _id: req.site._id },
      {
        repo: req.form.repo,
        env: req.form.env,
        testURL: req.form.testUrl,
        liveURL: req.form.liveUrl,
      },
      { new: true }
    );

    const environmentVariables = req.form.env.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const updateParams = {
      appId: req.site.appId,
      repository: req.form.repo,
      accessToken: process.env.GITHUB_OAUTH_TOKEN,
      environmentVariables,
    };

    const updateSite = new UpdateAppCommand(updateParams);
    const updateRes = await amplifyClient.send(updateSite);

    return NextResponse.json({
      update: updateRes,
      site: updateDB,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
