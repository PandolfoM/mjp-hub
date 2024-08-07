"use client";

import { z } from "zod";
import Button from "@/app/components/button";
import VerticalCard from "@/app/components/verticalcard";
import { DeploymentsI, Site } from "@/models/Site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCopy, faX } from "@fortawesome/free-solid-svg-icons";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
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
import { useSite } from "@/app/context/SiteContext";
import { useUser } from "@/app/context/UserContext";
import { Permissions } from "@/utils/permissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NameServersDialog from "@/app/components/dialogs/nameServersDialog";
import Popout from "@/app/components/popout";
import { copyToClipboard } from "@/utils/copyToClipboard";

const formSchema = z.object({
  repo: z.string().url(),
  testURL: z.string().optional(),
  liveURL: z.string().optional(),
  framework: z.string().optional(),
  env: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

const FRAMEWORKS = [
  { label: "Next.js - SSR", value: "nextjs-ssr" },
  { label: "React", value: "react" },
];

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { hasPermission, user } = useUser();
  const { setLoading } = useSite();
  const [site, setSite] = useState<Site>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nameServers, setNameServers] = useState<string[] | null>(null);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repo: "",
      testURL: "",
      liveURL: "",
      env: [{ key: "", value: "" }],
    },
  });

  const saveSite = async () => {
    setLoading(true);
    try {
      const frameworkLabel = FRAMEWORKS.find(
        (fw) => fw.value === form.getValues().framework
      )?.label;
      const newSite = await axios.post("/api/sites/updatesite", {
        form: form.getValues(),
        site: site,
        frameworkLabel: frameworkLabel,
      });

      setIsEdit(false);
      setError("");
      setSite(newSite.data.site);

      setNameServers(newSite.data.nameServers);
      setIsOpen(true);
      setLoading(false);
    } catch (error: any) {
      console.log(error.response);
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  const deleteSite = async () => {
    setLoading(true);
    try {
      await axios.post("/api/sites/deletesite", {
        site: site,
      });
      setError("");
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
        const res = await axios.post("/api/sites/getsite", {
          id: params.id,
        });

        if (res.data.data) {
          if (res.data.success) {
            setSite(res.data.data);
            form.setValue("liveURL", res.data.data.liveURL);
            form.setValue("testURL", res.data.data.testURL);
            form.setValue("repo", res.data.data.repo);
            form.setValue("framework", res.data.data.framework);
            if (res.data.data.env) {
              form.setValue("env", res.data.data.env);
            }
          } else {
            router.replace("/");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch site", error);
        setLoading(false);
      }
    };

    fetchSite();
  }, [params.id, router, form, setLoading]);

  const NotEditing = ({ site }: { site: Site }) => {
    return (
      <>
        <nav className="flex items-start justify-between w-full flex-col">
          <div className="flex gap-4 w-full justify-between items-center">
            <h3 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden text-left">
              {site.title}
            </h3>
            {(hasPermission(Permissions.Admin) ||
              hasPermission(Permissions.Developer)) && (
              <Button
                variant="ghost"
                className="text-sm"
                disabled={hasPermission(Permissions.User)}
                onClick={() => setIsEdit(true)}>
                Edit
              </Button>
            )}
          </div>
          <p className="text-xs">ID: {site._id}</p>
        </nav>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center">
            <strong>Repository: </strong>
            <Link
              href={site.repo}
              target="_blank"
              className="text-nowrap text-ellipsis overflow-hidden underline hover:no-underline">
              {site.repo}
            </Link>
            {user?.githubUsername &&
              (hasPermission(Permissions.Admin) ||
                hasPermission(Permissions.Developer)) && (
                <Popout text="Copy Git Clone">
                  <div className="hidden sm:block">
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => copyToClipboard(`${site.repo}.git`)}
                    />
                  </div>
                </Popout>
              )}
          </div>
          <p className="flex gap-2 items-center">
            <strong>Test URL: </strong>
            {site.testURL && (
              <Link
                href={`https://${site.testURL}`}
                target="_blank"
                className="text-nowrap text-ellipsis overflow-hidden underline hover:no-underline">
                {site.testURL}
              </Link>
            )}
          </p>
          <p className="flex gap-2 items-center">
            <strong>Live URL: </strong>
            {site.liveURL && (
              <Link
                href={`https://${site.liveURL}`}
                target="_blank"
                className="text-nowrap text-ellipsis overflow-hidden underline hover:no-underline">
                {site.liveURL}
              </Link>
            )}
          </p>
          <p className="flex gap-2 items-center">
            <strong>Environment Variables: </strong>
            <span className="text-nowrap text-ellipsis overflow-hidden">
              {site.env.length}
            </span>
          </p>
        </div>
      </>
    );
  };

  const getDeployments = async () => {
    setLoading(true);
    if (!site) return;

    try {
      const res = await axios.post<{ deployments: DeploymentsI[] }>(
        "/api/sites/getdeployments",
        {
          siteId: site._id,
          appId: site.appId,
          testAppId: site.testAppId,
        }
      );
      const deployments = res.data.deployments;

      // @ts-ignore
      setSite((prevSite: Site) => ({
        ...prevSite!,
        deployments: deployments,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("There has been an error");
      setLoading(false);
    }
  };

  return (
    <>
      {nameServers && (
        <NameServersDialog
          nameServers={nameServers}
          open={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      <div className="flex flex-col h-full w-full gap-5 p-2 sm:p-5">
        <nav className="flex justify-between items-center">
          <a
            onClick={() => router.back()}
            className="cursor-pointer no-underline">
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </a>
          {site && (
            <DeployDialog site={site} setSite={setSite}>
              {(hasPermission(Permissions.Admin) ||
                hasPermission(Permissions.Developer)) && (
                <Button disabled={!site.repo} onClick={getDeployments}>
                  Deployments
                </Button>
              )}
            </DeployDialog>
          )}
        </nav>
        <div className="flex items-center gap-2 flex-col h-full">
          {site && (
            <VerticalCard className="h-full w-full">
              <>
                {isEdit ? (
                  <Editing
                    form={form}
                    site={site}
                    onSubmit={saveSite}
                    deleteSite={deleteSite}
                    setIsEdit={setIsEdit}
                    error={error}
                  />
                ) : (
                  <NotEditing site={site} />
                )}
              </>
            </VerticalCard>
          )}
        </div>
      </div>
    </>
  );
}

type FormValues = z.infer<typeof formSchema>;
const EditingComponent = ({
  form,
  site,
  onSubmit,
  deleteSite,
  setIsEdit,
  error,
}: {
  form: UseFormReturn<FormValues>;
  site: Site;
  onSubmit: () => {};
  deleteSite: () => {};
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  error: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "env",
  });

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full">
          <div className="flex flex-col gap-[5px] text-left flex-1">
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
            <div className="flex items-center w-full gap-[5px]">
              <FormField
                control={form.control}
                name="testURL"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Test URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Test URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liveURL"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Live URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={site.framework}
                    // disabled={site.deployments.length > 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FRAMEWORKS.map((fw, i) => (
                        <SelectItem key={i} value={fw.value}>
                          {fw.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <FormItem className="w-1/2">
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
                    <FormItem className="w-1/2">
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
                  <FontAwesomeIcon icon={faX} className="pointer-events-none" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              className="w-full"
              onClick={() => append({ key: "", value: "" })}>
              Add Environment Variable
            </Button>
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
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
                type="submit"
                disabled={form.watch("repo") === ""}
                variant="filled"
                className="w-24 bg-primary">
                Save
              </Button>
            </div>
            <DeleteDialog onClick={deleteSite} name={site.title}>
              <Button variant="filled" className="w-24 bg-error h-full">
                Delete
              </Button>
            </DeleteDialog>
          </footer>
        </form>
      </Form>
    </div>
  );
};
const Editing = memo(EditingComponent);
Editing.displayName = "Editing";
