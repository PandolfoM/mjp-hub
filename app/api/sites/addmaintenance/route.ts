import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Maintenance from "@/models/Maintenance";

connect();

const addMaintenance = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { site, emails } = reqBody;

    const maintenanceRecord = await Maintenance.findOneAndUpdate(
      { siteId: site._id },
      {
        emails,
      }
    );

    if (!maintenanceRecord) {
      await Maintenance.create({
        siteId: site._id,
      });

      return NextResponse.json({
        success: true,
        message: "New maintenance record created",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Maintenance record updated",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(addMaintenance);
