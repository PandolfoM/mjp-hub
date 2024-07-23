import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Doc from "@/models/Doc";
import { NextRequest, NextResponse } from "next/server";

connect();

const deleteDoc = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { page } = reqBody;

    const doc = await Doc.findOneAndUpdate(
      { "pages._id": page._id },
      { $pull: { pages: { _id: page._id } } },
      { new: true }
    );

    if (!doc) {
      return NextResponse.json({
        message: "No doc found with the specified page id",
        success: false,
        data: [],
      });
    }

    if (doc.pages.length === 0) {
      const deletedCategory = await Doc.findByIdAndDelete(doc._id);
      console.log(deletedCategory);

      return NextResponse.json({
        message: "Document deleted as it has no pages left",
        success: true,
        deletedCategory,
        data: [],
      });
    }

    const response = NextResponse.json({
      message: "Doc created successfully",
      success: true,
      data: doc,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(deleteDoc);
