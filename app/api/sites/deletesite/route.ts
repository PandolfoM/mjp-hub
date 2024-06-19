import { NextRequest, NextResponse } from "next/server";
import { AmplifyClient, DeleteAppCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import { fromEnv } from "@aws-sdk/credential-providers";

const amplifyClient = new AmplifyClient({
  region: "us-east-1",
  // credentials: fromEnv(),
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { site } = req;

    const deleteLiveSite = new DeleteAppCommand({ appId: site.appId });
    await amplifyClient.send(deleteLiveSite);
    const deleteTestSite = new DeleteAppCommand({ appId: site.testAppId });
    await amplifyClient.send(deleteTestSite);

    await Site.findOneAndDelete({ _id: site._id });

    return NextResponse.json({
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
