import { NextRequest, NextResponse } from "next/server";
import { DeleteAppCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import amplifyClient from "@/utils/amplifyClient";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";

connect();

const deleteSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site } = reqBody;

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
};

export const POST = withAuth(deleteSite);
