import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import AccountCreated from "@/emails/accountCreated";
import { withAuth } from "@/middleware/auth";

const sendEmail = async (req: NextRequest): Promise<NextResponse> => {
  if (!process.env.RESEND_API_KEY) {
    console.error("no resend api key");
    return NextResponse.json(
      { error: "There has been an error" },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, password } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "MJP Hub <mjp@mattpandolfo.com>",
      to: email,
      subject: `Account Created`,
      react: AccountCreated({ email, password }),
      text: "Your account has been created",
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

export const POST = withAuth(sendEmail);
