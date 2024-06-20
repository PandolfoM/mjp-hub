import { NextRequest, NextResponse } from "next/server";
import { DeleteAppCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import amplifyClient from "@/utils/amplifyClient";
import { connect } from "@/lib/db";

connect();

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
