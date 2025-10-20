import { NextRequest, NextResponse } from "next/server";

declare global {
  var wsManager: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "new_booking" && body.booking) {
      // Use global wsManager instead of importing
      const wsManager = global.wsManager;

      if (wsManager) {
        // Notify all connected admin clients
        wsManager.notifyNewBooking(body.booking);

        return NextResponse.json({
          success: true,
          message: "Admin notified successfully",
        });
      } else {
        console.error("WebSocket manager not available");
        return NextResponse.json(
          {
            success: false,
            message: "WebSocket manager not available",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid notification type",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in notify-admin API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Notification API is working",
    endpoints: ["POST /api/notify-admin"],
  });
}
