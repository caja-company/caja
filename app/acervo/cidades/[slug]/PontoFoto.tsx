"use client";

export function PontoFoto({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        if (e.currentTarget.parentElement) {
          e.currentTarget.parentElement.style.background = "#E8D5BE";
        }
      }}
    />
  );
}
