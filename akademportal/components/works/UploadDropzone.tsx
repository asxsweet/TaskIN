"use client";

import { CloudUpload, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";

export function UploadDropzone({
  file,
  onFile,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center transition-all ${
        file ? "border-success bg-success-tint/20" : "border-neutral-200 bg-neutral-50"
      }`}
    >
      {!file ?
        <>
          <div className="h-16 w-16 rounded-full bg-primary-tint flex items-center justify-center text-primary mb-6">
            <CloudUpload size={32} />
          </div>
          <p className="text-lg font-medium mb-2">Файлды осында сүйреңіз</p>
          <p className="text-sm text-neutral-400 mb-8">немесе</p>
          <Button
            variant="outline"
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Файл таңдау
          </Button>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </>
      : <div className="w-full max-w-md">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-success/30 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-success-tint flex items-center justify-center text-success">
                <FileText size={24} />
              </div>
              <div>
                <div className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{file.name}</div>
                <div className="text-xs text-neutral-400">{formatBytes(file.size)}</div>
              </div>
            </div>
            <button type="button" onClick={() => onFile(null)} className="text-neutral-400 hover:text-danger">
              ✕
            </button>
          </div>
        </div>
      }
    </div>
  );
}
