"use client";

import { useSite } from "@/app/context/SiteContext";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Button from "@/app/components/button";
import { Doc } from "@/models/Doc";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/context/UserContext";
import { Permissions } from "@/utils/permissions";

const Editor = dynamic(() => import("@/app/components/editor"), { ssr: false });

function DocPage({ params }: { params: { doc: string } }) {
  const { setLoading } = useSite();
  const { hasPermission } = useUser();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [editorTxt, setEditorTxt] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);

      try {
        const res = await axios.post("/api/docs/getdoc", {
          route: params.doc,
        });

        if (res.data.data) {
          setDoc(res.data.data);
          setEditorTxt(res.data.data.pages[0].content);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchDoc();
  }, [params.doc, setLoading]);

  const saveDoc = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/docs/savedoc", {
        route: params.doc,
        content: editorTxt,
      });

      setEditorTxt(res.data.data.pages[0].content);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [editorTxt, params.doc, setLoading]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Check if Ctrl+S or Cmd+S was pressed
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent the default save action
        saveDoc(); // Call the save function
      }
    };

    // Register the event listener
    if (isEditing) {
      window.addEventListener("keydown", handleKeydown);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (isEditing) {
        window.removeEventListener("keydown", handleKeydown);
      }
    };
  }, [params.doc, isEditing, saveDoc]);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full flex justify-between items-center gap-2">
        {doc && <h1 className="font-bold text-lg">{doc.pages[0].name}</h1>}
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="filled"
              className="hidden sm:block bg-primary"
              onClick={() => {
                saveDoc();
                setIsEditing(false);
              }}>
              Save
            </Button>
          )}
          {doc && (
            <Button
              className={cn(
                hasPermission(Permissions.Manage) ||
                  hasPermission(Permissions.Admin)
                  ? "sm:block"
                  : "hidden"
              )}
              onClick={() => {
                setIsEditing(!isEditing);
              }}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
        </div>
      </div>
      <Editor value={editorTxt} setValue={setEditorTxt} readOnly={!isEditing} />
    </div>
  );
}

export default DocPage;
