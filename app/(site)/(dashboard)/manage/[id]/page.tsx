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
import { cn } from "@/lib/utils";
import { AWSGetDomain } from "@/utils/awsClientFunctions";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";

const formSchema = z.object({
  repo: z.string().url(),
  testURL: z.string().optional(),
  liveURL: z.string().optional(),
  framework: z.string().optional(),
  maintenanceEmailFrequency: z.string(),
  maintenanceEmails: z.string().optional(),
  deploymentEmailOption: z.string().optional(),
  deploymentEmails: z.string().optional(),
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

const MAINTENANCE_EMAIL_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Biannual", value: "biannual" },
  { label: "Yearly", value: "yearly" },
  { label: "Never", value: "never" },
];

const DEPLOYMENT_EMAIL_OPTIONS = [
  { label: "Requested User", value: "requestedUser" },
  { label: "Specific", value: "specific" },
  { label: "None", value: "none" },
];

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { hasPermission, user } = useUser();
  const { setLoading } = useSite();
  const [site, setSite] = useState<Site>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLiveUrlAvail, setIsLiveUrlAvail] = useState<boolean>(false);
  const [nameServers, setNameServers] = useState<string[] | null>(null);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repo: "",
      testURL: "",
      liveURL: "",
      maintenanceEmailFrequency: "never",
      maintenanceEmails: "",
      deploymentEmailOption: "requestedUser",
      deploymentEmails: "",
      env: [{ key: "", value: "" }],
    },
  });

  useEffect(() => {
    const fetchSite = async () => {
      setLoading(true);
      try {
        const res = await axios.post("/api/sites/getsite", {
          id: params.id,
        });
        const data = res.data.data;

        if (data) {
          if (res.data.success) {
            setSite(data);
            form.setValue("liveURL", data.liveURL);
            form.setValue("testURL", data.testURL);
            form.setValue("repo", data.repo);
            form.setValue("framework", data.framework);
            form.setValue(
              "maintenanceEmailFrequency",
              data.maintenanceEmailFrequency
            );
            form.setValue("maintenanceEmails", data.maintenanceEmails);
            form.setValue("deploymentEmailOption", data.deploymentEmailOption);
            form.setValue("deploymentEmails", data.deploymentEmails);
            if (data.env) {
              form.setValue("env", data.env);
            }
            if (data.liveURL) {
              const domain = await AWSGetDomain({
                appId: data.appId,
                domainName: data.liveURL,
              });

              if (domain?.domainAssociation?.domainStatus === "AVAILABLE") {
                setIsLiveUrlAvail(true);
              }
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

  const saveSite = async () => {
    setLoading(true);
    try {
      if (form.watch("deploymentEmailOption") !== "specific") {
        form.setValue("deploymentEmails", "");
      }

      const frameworkLabel = FRAMEWORKS.find(
        (fw) => fw.value === form.getValues().framework
      )?.label;

      const newSite = await axios.post("/api/sites/updatesite", {
        form: form.getValues(),
        site: site,
        frameworkLabel: frameworkLabel,
      });

      await axios.post("/api/sites/addmaintenance", {
        site: site,
        emails: form.getValues().maintenanceEmails,
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

  const NotEditing = ({ site }: { site: Site }) => {
    return (
      <div className="w-full flex flex-col gap-2 flex-1 lg:flex-row lg:h-full">
        <div className="flex flex-col w-full h-full min-h-[80%] lg:min-w-[70%]">
          <h3 className="self-start font-bold text-lg text-primary">Details</h3>
          <VerticalCard className="w-full h-full">
            <div className="flex flex-col gap-2 w-full">
              <nav className="border-b-2 border-primary flex items-baseline justify-between">
                <h3 className="text-md font-bold whitespace-nowrap text-ellipsis overflow-hidden text-left">
                  {site.title}
                </h3>
                {/* <p className="text-xs text-nowrap">ID: {site._id}</p> */}
              </nav>
              <div className="flex gap-2 items-center">
                <strong>Repository: </strong>
                <Link
                  href={site.repo}
                  target="_blank"
                  className="text-nowrap text-ellipsis overflow-hidden underline hover:no-underline">
                  {site.repo}
                </Link>
                {user?.githubUsername &&
                  site.repo &&
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
                  <>
                    <Link
                      href={`https://${site.liveURL}`}
                      target="_blank"
                      className="text-nowrap text-ellipsis overflow-hidden underline hover:no-underline">
                      {site.liveURL}
                    </Link>
                    <FontAwesomeIcon
                      icon={isLiveUrlAvail ? faCircleCheck : faCircleXmark}
                      className={cn(
                        isLiveUrlAvail ? "text-success" : "text-error"
                      )}
                    />
                  </>
                )}
              </p>
              <p className="flex gap-2 items-center">
                <strong>Environment Variables: </strong>
                <span className="text-nowrap text-ellipsis overflow-hidden">
                  {site.env.length}
                </span>
              </p>
            </div>
          </VerticalCard>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col">
            <h3 className="self-start font-bold text-lg text-primary">
              Notifications
            </h3>
            <VerticalCard className="w-full min-h-0 h-auto">
              <div className="flex flex-col gap-2 w-full">
                <nav className="border-b-2 border-primary">
                  <h3 className="text-md font-bold whitespace-nowrap text-ellipsis overflow-hidden text-left">
                    Emails
                  </h3>
                </nav>
                <div className="flex flex-col gap-2 w-full">
                  <p className="flex gap-2 items-center">
                    <strong>Maintenance Emails: </strong>
                    <span className="text-nowrap text-ellipsis overflow-hidden capitalize">
                      {site.maintenanceEmailFrequency}
                    </span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <strong>Deployment Emails: </strong>
                    <span className="text-nowrap text-ellipsis overflow-hidden capitalize">
                      {
                        DEPLOYMENT_EMAIL_OPTIONS.find(
                          (option) =>
                            option.value === site.deploymentEmailOption
                        )?.label
                      }
                    </span>
                  </p>
                </div>
              </div>
            </VerticalCard>
          </div>
        </div>
      </div>
    );
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
                <Button disabled={!site.repo}>Deployments</Button>
              )}
            </DeployDialog>
          )}
        </nav>
        <div className="flex items-center gap-2 flex-col h-full">
          {site && (
            <>
              <nav className="flex items-start justify-between w-full flex-col">
                <div className="flex gap-4 w-full justify-between items-center lg:justify-start">
                  <h3 className="text-lg font-bold whitespace-nowrap text-ellipsis overflow-hidden text-left text-primary">
                    Site Setup
                  </h3>
                  {(hasPermission(Permissions.Admin) ||
                    hasPermission(Permissions.Developer)) && (
                    <Button
                      variant="ghost"
                      className="text-sm"
                      disabled={hasPermission(Permissions.User)}
                      onClick={() => setIsEdit(!isEdit)}>
                      {isEdit ? "Cancel" : "Edit"}
                    </Button>
                  )}
                </div>
                <p className="text-sm">
                  Provide the details to create a new site
                </p>
              </nav>
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
    <div className="w-full flex flex-col gap-2 flex-1 lg:flex-row lg:h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full w-full gap-2 lg:flex-row">
          <div className="flex flex-col w-full h-full lg:min-w-[70%]">
            <h3 className="self-start font-bold text-lg text-primary">
              Details
            </h3>
            <VerticalCard className="w-full h-full">
              <>
                <div className="flex flex-col gap-[5px] text-left flex-1 w-full">
                  <div className="flex items-center w-full gap-[5px]">
                    <FormField
                      control={form.control}
                      name="repo"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Repository</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="Repository"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="framework"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
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
                  </div>
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
                        <FontAwesomeIcon
                          icon={faX}
                          className="pointer-events-none"
                        />
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
                <footer className="flex justify-between w-full items-center pt-2">
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
                      disabled={
                        form.watch("repo") === "" || !form.formState.isDirty
                      }
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
              </>
            </VerticalCard>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col">
              <h3 className="self-start font-bold text-lg text-primary">
                Notifications
              </h3>
              <VerticalCard className="w-full min-h-0 h-auto">
                <>
                  <div className="flex flex-col gap-[5px] w-full">
                    <FormField
                      control={form.control}
                      name="maintenanceEmailFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maintenance Emails</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={site.maintenanceEmailFrequency}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select how often to send an email" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MAINTENANCE_EMAIL_OPTIONS.map((option, i) => (
                                <SelectItem key={i} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maintenanceEmails"
                      render={({ field }) => (
                        <FormItem
                          className={cn(
                            form.getValues().maintenanceEmailFrequency ===
                              "never" && "hidden"
                          )}>
                          <FormLabel>Maintenance Email Receivers</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email Addresses (separate with comma)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deploymentEmailOption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deployment Emails</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={site.deploymentEmailOption}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select how often to send an email" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEPLOYMENT_EMAIL_OPTIONS.map((option, i) => (
                                <SelectItem key={i} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    {form.watch("deploymentEmailOption") === "specific" && (
                      <FormField
                        control={form.control}
                        name="deploymentEmails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deployment Email Receivers</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Email Addresses (separate with comma)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </>
              </VerticalCard>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
const Editing = memo(EditingComponent);
Editing.displayName = "Editing";
