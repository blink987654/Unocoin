import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "India's Bitcoin Platform";
  const subtitle =
    searchParams.get("subtitle") ||
    "Since 2013. 2.26M+ users. Powered by Unocoin.";
  const type = searchParams.get("type") || "default"; // default | waitlist | blog

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          background: "#0A0A0A",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(247,147,26,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(247,147,26,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "4px",
            background:
              "linear-gradient(90deg, #F7931A 0%, #FFAB40 50%, #F7931A 100%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 80px 60px",
            flex: "1",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.5px",
                }}
              >
                India
              </span>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#F7931A",
                  letterSpacing: "-0.5px",
                }}
              >
                Bitcoin
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "#666666",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginLeft: "8px",
              }}
            >
              Powered by Unocoin
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: type === "waitlist" ? "56px" : "52px",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              maxWidth: "900px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "22px",
              color: "#999999",
              marginTop: "24px",
              lineHeight: 1.5,
              maxWidth: "700px",
              display: "flex",
            }}
          >
            {subtitle}
          </div>

          {/* Waitlist badge */}
          {type === "waitlist" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #F7931A 0%, #FFAB40 100%)",
                  borderRadius: "12px",
                  padding: "14px 28px",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Join the Waitlist
              </div>
              <span
                style={{
                  fontSize: "16px",
                  color: "#666666",
                  display: "flex",
                }}
              >
                Free forever. Start from Rs.10.
              </span>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 80px 40px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "32px",
              fontSize: "14px",
              color: "#555555",
            }}
          >
            <span style={{ display: "flex" }}>Est. 2013</span>
            <span style={{ display: "flex" }}>2.26M+ Users</span>
            <span style={{ display: "flex" }}>Rs.3,000 Cr+ Volume</span>
            <span style={{ display: "flex" }}>0% SBP Fees</span>
          </div>

          {/* India flag dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#FF9933",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#138808",
                display: "flex",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
