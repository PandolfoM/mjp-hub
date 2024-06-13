import { NextRequest, NextResponse } from "next/server";
import { AmplifyClient, UpdateAppCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";

const amplifyClient = new AmplifyClient({ region: "us-east-1" });

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    console.log(req.form.env);

    const updateDB = await Site.findOneAndUpdate(
      { _id: req.site._id },
      {
        repo: req.form.repo,
        env: req.form.env,
        testURL: req.form.testUrl,
        liveURL: req.form.liveUrl,
      }
    );

    // const updateParams = {
    //   appId,
    //   repository: req.form.repo,
    //   environmentVariables: req.form.env,
    // };

    // const updateSite = new UpdateAppCommand(updateParams);
    // const updateResponse = await amplifyClient.send(updateSite);

    return NextResponse.json(updateDB);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
