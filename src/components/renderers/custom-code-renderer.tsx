"use client";

export default function CustomCodeRenderer({
  data,
}: {
  data: { code: string };
}) {
  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}
