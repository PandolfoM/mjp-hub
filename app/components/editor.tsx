"use client";

import { SetStateAction, Dispatch, useRef } from "react";
import ReactQuill from "react-quill";
("react-quill");
import "react-quill/dist/quill.bubble.css";
import "@/app/quill.css";

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
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],

        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };

  return (
    <div ref={editorRef} className="w-full h-full" id="editor">
      <ReactQuill
        readOnly={readOnly}
        placeholder="Start typing here..."
        theme="bubble"
        value={value}
        formats={formats}
        onChange={setValue}
        modules={modules}
        bounds={"#editor"}
        className="custom-scrollbar h-full w-full resize-none col-span-3 bg-transparent text-white pl-2 pr-6 py-1 text-sm placeholder:text-white/40 leading-6 border-none outline-none disabled:bg-zinc-500/20 disabled:text-white/50"
      />
    </div>
  );
}

export default Editor;
