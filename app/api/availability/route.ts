import { getAvailability } from "@/lib/availability";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const courtId = searchParams.get("courtId");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    const date = new Date(dateStr);
    const { availability, courts } = await getAvailability(date, courtId);

    if (courtId) {
      return NextResponse.json({ date: dateStr, courtId, availability });
    }

    return NextResponse.json({ date: dateStr, availability, courts });
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 },
    );
  }
}
