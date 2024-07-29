import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import Button from "../button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSite } from "@/app/context/SiteContext";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Doc } from "@/models/Doc";

type Props = {
  children: ReactNode;
  setDocs: Dispatch<SetStateAction<Doc[]>>;
  categories: { label: string; value: string }[];
};

const formSchema = z
  .object({
    title: z.string().min(1, { message: "Required" }),
    category: z.string().min(1, { message: "Required" }),
    newCategory: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.category === "new" && !data.newCategory) {
        return false;
      }
      return true;
    },
    {
      message: "Required",
      path: ["newCategory"],
    }
  );

function NewDocDialog({ children, setDocs, categories }: Props) {
  const { setLoading, loading } = useSite();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const category = useWatch({
    control: form.control,
    name: "category",
  });

  const createDoc = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const category = categories.find((cat) => cat.value === data.category);
      const res = await axios.post("/api/docs/newdoc", {
        title: data.title,
        category: category,
        categoryRoute:
          data.category === "new" ? data.category : category?.label,
        newCategory: data.newCategory,
      });

      setDocs(res.data.data);
      router.push(
        `/docs/${data.category}/${data.title.toLowerCase().replace(/\s+/g, "")}`
      );
      router.refresh();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-background/40" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Create Site</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createDoc)}
              className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="title"
                defaultValue={""}
                render={({ field }) => (
                  <FormItem className="sm:w-full space-y-0">
                    <FormControl>
                      <Input type="text" placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                defaultValue={""}
                render={({ field }) => (
                  <FormItem className="sm:w-full space-y-0">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="filled"
                            className={cn(
                              "h-10 w-full bg-white/5 text-left text-sm text-white flex items-center justify-between",
                              !field.value && "text-white/50"
                            )}>
                            {field.value
                              ? categories.find(
                                  (cat) => cat.value === field.value
                                )?.label
                              : "Select Category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandEmpty>No permission found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {categories.map((cat) => (
                                <CommandItem
                                  value={cat.label}
                                  key={cat.value}
                                  onSelect={() => {
                                    form.setValue("category", cat.value);
                                  }}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      cat.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {cat.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {category === "new" && (
                <FormField
                  control={form.control}
                  name="newCategory"
                  defaultValue={""}
                  render={({ field }) => (
                    <FormItem className="sm:w-full space-y-0">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="New Category"
                          {...field}
                          onInput={(e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(/[^a-zA-Z\s]/g, "");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={loading}
                  className="sm:w-20 border-white/50">
                  Create
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={loading}
                    className="sm:w-20 border-white/50">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default NewDocDialog;
