import { NextRequest, NextResponse } from "next/server";
import { DeleteAppCommand } from "@aws-sdk/client-amplify";
import Site from "@/models/Site";
import { amplifyClient } from "@/utils/amplifyClient";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import { AWSDeleteApp } from "@/utils/awsClientFunctions";

connect();

const deleteSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site } = reqBody;

    await AWSDeleteApp({ appId: site.appId });
    await AWSDeleteApp({ appId: site.testAppId });

    await Site.findOneAndDelete({ _id: site._id });

    return NextResponse.json({
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(deleteSite);
