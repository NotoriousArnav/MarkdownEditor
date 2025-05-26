import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { extMan } from "@/lib/extMan";

interface ExtensionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  setExtension: (extension: string) => void;
}

export const ExtensionManager = ({
  isOpen,
  onClose,
  setExtension
}: ExtensionManagerProps) => {
  const extURL = useRef<HTMLInputElement>(null);
  const [extensions, setExtensions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentExtension, setCurrentExtension] = useState<string | null>(null);

  // Load extensions from extMan
  useEffect(() => {
    setExtensions(extMan.getExtensionUrls());
  }, [isOpen]);

  const handleAdd = async () => {
    setError(null);
    const url = extURL.current?.value?.trim();
    if (!url) {
      setError("Please enter a valid extension URL.");
      return;
    }
    setLoading(true);
    const mod = await extMan.loadExtension(url);
    setLoading(false);
    if (mod) {
      setExtensions(extMan.getExtensionUrls());
      extURL.current!.value = "";
    } else {
      setError("Failed to load extension. Check the URL or console for details.");
    }
  };

  const handleRemove = (url: string) => {
    extMan.removeExtension(url);
    setExtensions(extMan.getExtensionUrls());
    if (currentExtension === url) setCurrentExtension(null);
  };

  const handleUpdate = async (url: string) => {
    setLoading(true);
    extMan.removeExtension(url);
    await extMan.loadExtension(url);
    setExtensions(extMan.getExtensionUrls());
    setLoading(false);
  };

  const filtered = extensions.filter(ext => ext.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Extensions</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-0">
          <div className="flex items-center mb-4 gap-2">
            <Input
              type="text"
              ref={extURL}
              placeholder="Add new extension (paste URL)"
              disabled={loading}
            />
            <Button
              variant="outline"
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Extension"}
            </Button>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Search extensions"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="text-sm">
              Showing {filtered.length} extension{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <ScrollArea className="h-[400px] mt-2">
            <div className="flex flex-col gap-2">
              {filtered.length === 0 && <div className="text-gray-500 text-sm">No extensions found.</div>}
              {filtered.map((ext, index) => (
                <div key={index} className="flex items-center gap-2 border rounded p-2">
                  <Button
                    variant={currentExtension === ext ? "primary" : "secondary"}
                    className="flex-1 text-left truncate"
                    onClick={() => { setCurrentExtension(ext); setExtension(ext); }}
                  >
                    {ext}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdate(ext)} disabled={loading}>
                    Update
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleRemove(ext)} disabled={loading}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
