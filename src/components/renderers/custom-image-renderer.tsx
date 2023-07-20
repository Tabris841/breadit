"use client";

import Image from "next/image";

export default function CustomImageRenderer({
  data,
}: {
  data: { file: { url: string } };
}) {
  const src = data.file.url;

  return (
    <div className="relative min-h-[15rem] w-full">
      <Image
        alt="image"
        className="object-contain"
        fill
        src={src}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
