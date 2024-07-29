import { toast } from "sonner";

export function copyToClipboard(text: string) {
  toast.success("Copied!");
  navigator.clipboard.writeText(text);
}
