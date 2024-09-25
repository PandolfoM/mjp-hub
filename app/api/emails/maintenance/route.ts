import { Resend } from "resend";
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import MaintenanceEmail from "@/emails/maintenance";
import Maintenance, { MaintenanceI } from "@/models/Maintenance";
import Site from "@/models/Site";
import { formToNumber } from "@/utils/functions";

connect();

export async function POST() {
  if (!process.env.RESEND_API_KEY) {
    console.error("no resend api key");
    return NextResponse.json(
      { error: "There has been an error" },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const sites: MaintenanceI[] = await Maintenance.find();
    let results = [];

    for (let i = 0; i < sites.length; i++) {
      let emails = sites[i].emails.split(",").map((email) => email.trim());
      const siteDoc = await Site.findById(sites[i].siteId);
      const today = new Date();
      const siteDate = siteDoc.maintenanceSendDate;
      const isSameDay =
        today.getDate() === siteDate.getDate() &&
        today.getMonth() === siteDate.getMonth() &&
        today.getFullYear() === siteDate.getFullYear();

      if (isSameDay) {
        const date = siteDoc.maintenanceSendDate;
        const newDate = new Date(
          date.getFullYear(),
          date.getMonth() + formToNumber(siteDoc.maintenanceEmailFrequency),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
        );

        const { data, error } = await resend.emails.send({
          from: "MJP Hub <mjp@mattpandolfo.com>",
          to: emails,
          subject: `Maintenance reminder`,
          react: MaintenanceEmail({
            maintenanceDoc: sites[i],
            site: siteDoc,
            newDate,
          }),
          text: `Maintenance reminder for ${siteDoc.title}`,
        });

        if (error) {
          console.error("Resend API error:", error);
          return NextResponse.json({ error }, { status: 500 });
        }

        await Site.findOneAndUpdate(
          { _id: siteDoc._id },
          {
            maintenanceSendDate: newDate,
          }
        );

        results.push({ site: sites[i], data });
      }
    }
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
