import { NextRequest, NextResponse } from "next/server";
import Site from "@/models/Site";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import { AWSDeleteApp, AWSDeleteDomain, AWSDeleteHostedZone, AWSGetDomain } from "@/utils/awsClientFunctions";

connect();

const deleteSite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site } = reqBody;

    await AWSDeleteApp({ appId: site.appId });
    await AWSDeleteApp({ appId: site.testAppId });

    if (site.zoneId) {
      await AWSDeleteHostedZone({ Id: site.zoneId });
    }

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

    await Site.findOneAndDelete({ _id: site._id });

    return NextResponse.json({
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(deleteSite);
