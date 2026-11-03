import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    await connectDB();
    const user = await User.findById(session.userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null });
  }
}
