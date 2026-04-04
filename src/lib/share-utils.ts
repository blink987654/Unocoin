/**
 * Shared utility for creating shareable images from canvas
 * Used by Bitcoin Time Machine and Bitcoin Kundali share cards
 */

export async function shareOrDownload(canvas: HTMLCanvasElement, title: string) {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (!blob) throw new Error("Failed to create blob");

    const file = new File([blob], `${title.replace(/\s+/g, "-").toLowerCase()}.png`, {
      type: "image/png",
    });

    // Try native share (mobile)
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title,
        files: [file],
      });
      return true;
    }

    // Fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
