import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, referrer, user_agent } = body;

    // Validate required fields
    if (!page_path) {
      return NextResponse.json(
        { error: "Missing required field: page_path" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert visitor record
    const { error } = await supabase.from("visitor_analytics").insert([
      {
        page_path,
        referrer: referrer || null,
        user_agent: user_agent || null,
      },
    ]);

    if (error) {
      console.error("Error inserting visitor record:", error);
      return NextResponse.json(
        { error: "Failed to record visit" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in visitor tracking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
