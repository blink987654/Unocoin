import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, #F7931A, #E8820E)",
            borderRadius: 6,
            transform: "rotate(45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 16,
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
