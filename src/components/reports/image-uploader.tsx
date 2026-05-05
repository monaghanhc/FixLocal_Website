"use client";

import { ChangeEvent, useState } from "react";
import { Camera, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

type ImageUploaderProps = {
  imagePath: string;
  onUploaded: (imagePath: string) => void;
};

export function ImageUploader({ imagePath, onUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      onUploaded(data.imagePath);
      toast.success("Photo uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      {imagePath ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <img src={imagePath} alt="Uploaded issue preview" className="h-80 w-full object-cover" />
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="focus-ring absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <X className="h-4 w-4" />
            Remove
          </button>
        </div>
      ) : (
        <label className="focus-within:outline-civic-blue flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-civic-blue hover:bg-blue-50/40">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleChange}
            disabled={uploading}
          />
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-white text-civic-blue shadow-sm">
            {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
          </div>
          <p className="mt-4 text-base font-bold text-civic-ink">
            {uploading ? "Uploading photo" : "Upload an issue photo"}
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            JPG, PNG, WEBP, or GIF up to 8MB. The file is stored locally for development.
          </p>
        </label>
      )}

      <div className="mt-4 flex items-start gap-3 rounded-lg bg-civic-mint/65 p-3 text-sm text-slate-700">
        <Camera className="mt-0.5 h-4 w-4 flex-none text-civic-teal" />
        <p>
          A clear photo helps the report mention attachments accurately. Users still review the
          generated text before sending.
        </p>
      </div>
    </div>
  );
}
