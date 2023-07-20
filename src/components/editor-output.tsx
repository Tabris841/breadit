"use client";

import dynamic from "next/dynamic";

import CustomCodeRenderer from "@/components/renderers/custom-code-renderer";
import CustomImageRenderer from "@/components/renderers/custom-image-renderer";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
);

type Props = {
  content: unknown;
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput = ({ content }: Props) => {
  return (
    <Output
      style={style}
      className="text-sm"
      renderers={renderers}
      data={content}
    />
  );
};

export default EditorOutput;
