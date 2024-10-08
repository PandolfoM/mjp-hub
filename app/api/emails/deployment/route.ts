import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import Deployment from "@/emails/deployment";
import Site, { DeploymentsI } from "@/models/Site";
import { connect } from "@/lib/db";

connect();

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("no resend api key");
    return NextResponse.json(
      { error: "There has been an error" },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteId = await req.json();

  try {
    const site = await Site.findById(siteId.id);
    let toEmails;

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (!site.deployments || site.deployments.length === 0) {
      return NextResponse.json(
        { error: "No deployments found" },
        { status: 404 }
      );
    }

    const latestDeployment: DeploymentsI = site.deployments.sort(
      (a: DeploymentsI, b: DeploymentsI) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];

    if (site.deploymentEmailOption === "none")
      return NextResponse.json({ error: "No email to send" });
    else if (site.deploymentEmailOption === "specific") {
      if (!site.deploymentEmails) {
        return NextResponse.json({ error: "No emails specified" });
      }

      const emailArray = site.deploymentEmails
        .split(",")
        .map((email: string) => email.trim());

      toEmails = emailArray;
    } else {
      toEmails = latestDeployment.deployedBy;
    }

    const { data, error } = await resend.emails.send({
      from: "MJP Hub <mjp@mattpandolfo.com>",
      to: toEmails,
      subject: `Deployment Finished`,
      react: Deployment({ site, endDate: new Date() }),
      text: "Deployment Finished",
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
