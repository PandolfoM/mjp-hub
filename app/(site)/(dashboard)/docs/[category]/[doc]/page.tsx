"use client";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.bubble.css";
import { useSite } from "@/app/context/SiteContext";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "@/app/components/button";
import { Doc } from "@/models/Doc";

function DocPage({ params }: { params: { doc: string } }) {
  const { setLoading } = useSite();
  const [doc, setDoc] = useState<Doc>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { quill, quillRef, editor } = useQuill({
    theme: "bubble",
    readOnly: true,
  });

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);

      try {
        const res = await axios.post("/api/docs/getdoc", {
          route: params.doc,
        });

        setDoc(res.data.data);
        if (quill) {
          quill.clipboard.dangerouslyPasteHTML(res.data.data.pages[0].content);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchDoc();
  }, [params.doc, setLoading, quill]);

  const saveDoc = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/docs/savedoc", {
        route: params.doc,
        content: quill?.root.innerHTML,
      });

      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(res.data.data.pages[0].content);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex justify-between items-center gap-2">
        <h1 className="font-bold text-lg">{doc?.pages[0].name}</h1>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="filled"
              className="hidden sm:block bg-primary"
              onClick={() => {
                saveDoc();
                editor?.disable();
                setIsEditing(!isEditing);
              }}>
              Save
            </Button>
          )}
          <Button
            className="hidden sm:block"
            onClick={() => {
              isEditing ? editor?.disable() : editor?.enable();
              setIsEditing(!isEditing);
            }}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
      <div ref={quillRef} />
    </div>
  );
}

export default DocPage;
