import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import Deployment from "@/emails/deployment";
import { withAuth } from "@/middleware/auth";

const deployment = async (req: NextRequest): Promise<NextResponse> => {
  if (!process.env.RESEND_API_KEY) {
    console.error("no resend api key");
    return NextResponse.json(
      { error: "There has been an error" },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const data = await req.json();
  console.log(data);

  try {
    const { data, error } = await resend.emails.send({
      from: "MJP Hub <mjp@mattpandolfo.com>",
      to: "matt@pandolfo.com",
      subject: `Deployment Finished`,
      react: Deployment(),
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
};

export const POST = deployment;
