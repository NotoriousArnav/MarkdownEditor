import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Copy, Link, Eye, Clock, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: (action: string) => void;
  onShare: (filename: string, duration: number) => Promise<string>;
  initialFilename?: string;
}

export function ShareDialog({ isOpen, onClose, onShare, initialFilename = "document.md" }: ShareDialogProps) {
  const [filename, setFilename] = useState(initialFilename);
  const [duration, setDuration] = useState(24);
  const [rawLink, setRawLink] = useState("");
  const [appLink, setAppLink] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFilename(initialFilename);
      setDuration(24);
      setRawLink("");
      setAppLink("");
      setPreviewMode(false);
      setIsShared(false);
    }
  }, [isOpen, initialFilename]);

  // Update the app link when preview toggle changes
  useEffect(() => {
    if (appLink) {
      const baseAppLink = appLink.split("&preview=")[0];
      setAppLink(previewMode ? `${baseAppLink}&preview=true` : baseAppLink);
    }
  }, [previewMode]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const link = await onShare(filename, duration);
      setRawLink(link);
      
      // Create app link from raw link
      const appBaseLink = `${window.location.href.split('?')[0]}?fetchFrom=${link}`;
      setAppLink(previewMode ? `${appBaseLink}&preview=true` : appBaseLink);
      
      setIsShared(true);
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = (linkType: 'raw' | 'app') => {
    const linkToCopy = linkType === 'raw' ? rawLink : appLink;
    navigator.clipboard.writeText(linkToCopy);
    onClose(`copy-${linkType}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("close")}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Configure sharing options and generate a shareable link.
          </DialogDescription>
        </DialogHeader>
        
        {!isShared ? (
          // Sharing configuration form
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filename" className="text-right"><File className="h-4 w-4 inline mr-1" /> Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right"><Clock className="h-4 w-4 inline mr-1" /> Duration</Label>
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                onClick={() => onClose("cancel")} 
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleShare} 
                disabled={isSharing}
              >
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>
        ) : (
          // Generated links display
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="raw-link" className="flex items-center">
                <Link className="h-4 w-4 mr-1" /> Raw Share Link
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="raw-link"
                  value={rawLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={() => handleCopy('raw')}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="app-link" className="flex items-center">
                <Link className="h-4 w-4 mr-1" /> Application Share Link
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="app-link"
                  value={appLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={() => handleCopy('app')}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Label htmlFor="preview-mode" className="flex items-center cursor-pointer">
                <Eye className="h-4 w-4 mr-1" /> Open in Preview Mode
              </Label>
              <Switch
                id="preview-mode"
                checked={previewMode}
                onCheckedChange={setPreviewMode}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                onClick={() => setIsShared(false)} 
                variant="outline"
              >
                Back
              </Button>
              <Button 
                onClick={() => onClose("done")} 
                variant="default"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
