"use client";

import { z } from "zod";
import Button from "@/app/components/button";
import VerticalCard from "@/app/components/verticalcard";
import { Site } from "@/models/Site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faX } from "@fortawesome/free-solid-svg-icons";
import Spinner from "@/app/components/spinner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { DeleteDialog, DeployDialog } from "@/app/components/dialogs";

const formSchema = z.object({
  repo: z.string().optional(),
  testUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  env: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [site, setSite] = useState<Site>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repo: "",
      testUrl: "",
      liveUrl: "",
      env: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "env",
  });

  const saveSite = async (site: Site) => {
    setLoading(true);
    try {
      const newSite = await axios.post("/api/sites/updatesite", {
        form: form.getValues(),
        site: site,
      });
      setSite(newSite.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteSite = async () => {
    setLoading(true);
    try {
      await axios.post("/api/sites/deletesite", {
        site: site,
      });
      router.push("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSite = async () => {
      setLoading(true);
      try {
        await fetch("/api/sites/getsite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: params.id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setSite(data.data);
              form.setValue("liveUrl", data.data.liveURL);
              form.setValue("testUrl", data.data.testURL);
              form.setValue("repo", data.data.repo);
              if (data.data.env) {
                form.setValue("env", data.data.env);
              }
            } else {
              router.replace("/");
            }
            setLoading(false);
          })
          .catch(() => {
            router.replace("/");
            setLoading(false);
          });
      } catch (error) {
        console.error("Failed to fetch sites", error);
        setLoading(false);
      }
    };

    fetchSite();
  }, [params.id, router]);

  const NotEditing = ({ site }: { site: Site }) => {
    return (
      <>
        <nav className="flex items-start justify-between w-full flex-col">
          <div className="flex gap-4 w-full justify-between items-center">
            <h3 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden text-left">
              {site.title}
            </h3>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => setIsEdit(true)}>
              Edit
            </Button>
          </div>
          <p className="text-xs">ID: {site._id}</p>
        </nav>
        <div className="flex flex-col gap-2">
          <p>
            <strong>Repository: </strong>
            <Link href={site.repo}>
              <Button variant="ghost">{site.repo}</Button>
            </Link>
          </p>
          <p>
            <strong>Test URL: </strong>
            <Link href={site.testURL}>
              <Button variant="ghost">{site.testURL}</Button>
            </Link>
          </p>
          <p>
            <strong>Live URL: </strong>
            <Link href={site.liveURL}>
              <Button variant="ghost">{site.liveURL}</Button>
            </Link>
          </p>
          <p>
            <strong>Environment Variables: </strong>
            <span className="px-3 py-1">{site.env.length}</span>
          </p>
        </div>
      </>
    );
  };

  const Editing = ({ site }: { site: Site }) => {
    return (
      <div className="flex flex-col gap-2 h-full w-full">
        <div className="flex-1">
          <Form {...form}>
            <form className="flex flex-col gap-[5px] text-left">
              <FormField
                control={form.control}
                name="repo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="Repository" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="Test URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="Live URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel className="my-2">Environment Variables</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-1">
                  <FormField
                    control={form.control}
                    name={`env.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`env.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="filled"
                    className="w-10 bg-error"
                    onClick={() => remove(index)}>
                    <FontAwesomeIcon
                      icon={faX}
                      className="pointer-events-none text-white/80"
                    />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ key: "", value: "" })}>
                Add Environment Variable
              </Button>
            </form>
          </Form>
        </div>
        <footer className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-24 border-white/50"
              onClick={() => {
                setIsEdit(false);
              }}>
              Cancel
            </Button>
            <Button
              variant="filled"
              className="w-24 bg-primary"
              onClick={() => {
                saveSite(site);
              }}>
              Save
            </Button>
          </div>
          <DeleteDialog onClick={deleteSite} name={site.title}>
            <Button variant="filled" className="w-24 bg-error h-full">
              Delete
            </Button>
          </DeleteDialog>
        </footer>
      </div>
    );
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="flex flex-col gap-5 h-full">
        <nav className="flex justify-between h-8 px-2 mt-2 items-center">
          <a onClick={() => router.back()} className="cursor-pointer">
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </a>
          {site && (
            <DeployDialog site={site}>
              <Button disabled={!site.repo}>Deployments</Button>
            </DeployDialog>
          )}
        </nav>
        <div className="flex items-center gap-2 flex-col h-full p-2">
          {site && (
            <VerticalCard className="min-h-full min-w-full">
              <>
                {isEdit ? <Editing site={site} /> : <NotEditing site={site} />}
              </>
            </VerticalCard>
          )}
        </div>
      </div>
    </>
  );
}
