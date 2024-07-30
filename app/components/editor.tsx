"use client";

import { SetStateAction, Dispatch, useRef } from "react";
import ReactQuill from "react-quill";
("react-quill");
import "react-quill/dist/quill.bubble.css";
import "@/app/quill.css";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  readOnly: boolean;
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "code",
  "list",
  "bullet",
  "color",
  "background",
  "indent",
  "link",
  "image",
  "align",
  "direction",
];

function Editor({ value, setValue, readOnly }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block", "code"],
        ["link", "image", "video"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
          {
            color: [
              "#F300AE",
              "#8E39C5",
              "#7B61FF",
              "#ffffff",
              "#000000",
              "#B3001B",
              "#72C96E",
              "#E3B23C",
            ],
          },
          {
            background: [
              "#F300AE",
              "#8E39C5",
              "#7B61FF",
              "#ffffff",
              "#000000",
              "#B3001B",
              "#72C96E",
              "#E3B23C",
            ],
          },
        ], // dropdown with defaults from theme
        [{ align: [] }],

        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };

  return (
    <div
      ref={editorRef}
      className={cn("w-full h-full overflow-hidden", !readOnly && "bg-card/5")}
      id="editor">
      <ReactQuill
        readOnly={readOnly}
        placeholder="Start typing here..."
        theme="bubble"
        value={value}
        formats={formats}
        onChange={setValue}
        modules={modules}
        bounds={"#editor"}
        className="custom-scrollbar h-full w-full resize-none col-span-3 bg-transparent text-white p-0 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
      />
    </div>
  );
}

export default Editor;
