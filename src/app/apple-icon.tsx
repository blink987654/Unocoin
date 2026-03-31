import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            background: "linear-gradient(135deg, #F7931A, #E8820E)",
            borderRadius: 28,
            transform: "rotate(45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 72,
              fontWeight: 800,
              transform: "rotate(-45deg)",
              fontFamily: "sans-serif",
            }}
          >
            U
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
