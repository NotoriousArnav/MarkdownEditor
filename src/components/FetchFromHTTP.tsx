import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRef } from "react";

interface FetchFromHTTPProps {
  isOpen: boolean,
  onClose: (action: string) => void
}

export function FetchFromHTTP({ isOpen, onClose }: FetchFromHTTPProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fetch Markdown from URL</DialogTitle>
          <DialogDescription>
            Enter the URL of the Markdown file you want to fetch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <Input
            ref={inputRef}
            className="col-span-3"
          />
          <Button
            onClick={() => onClose(inputRef.current?.value || false)}
            className="w-full"
            variant="outline"
          >
            Fetch
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
