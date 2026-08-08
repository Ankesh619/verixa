import { useRef, useState } from "react";
import { supabase } from "../supabase";

type Props = {
  title: string;
  folder: string;
  onUploaded: (url: string) => void;
};

function DocumentUploader({
  title,
  folder,
  onUploaded,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10 MB.");
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);
    setStatus("Uploading...");

    try {
      const safeFileName = file.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );

      const fileName = `${Date.now()}_${safeFileName}`;

      /*
       * folder example:
       * applications/service-id
       */
      const filePath = `${folder}/${fileName}`;

      setProgress(20);

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(80);

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      if (!publicUrl) {
        throw new Error(
          "Could not get uploaded document URL."
        );
      }

      setProgress(100);

      setPreview(publicUrl);

      onUploaded(publicUrl);

      setUploading(false);
      setStatus("Document Uploaded Successfully");
    } catch (error: any) {
      console.error(
        "Supabase Storage Upload Error:",
        error
      );

      setUploading(false);
      setProgress(0);
      setStatus("");

      setError(
        error?.message ||
          "Document upload failed."
      );
    }
  };

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    uploadFile(file);

    e.target.value = "";
  };

  const removeImage = () => {
    setPreview("");
    setProgress(0);
    setStatus("");
    setError("");
    setUploading(false);

    onUploaded("");
  };

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="text-gray-500 mt-1">
            Take Photo or Upload Image
          </p>
        </div>

        <button
          type="button"
          onClick={chooseFile}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl font-semibold"
        >
          📷 Capture / Upload
        </button>

      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={onFileChange}
      />

      {uploading && (
        <div className="mt-2">

          <div className="flex justify-between text-sm mb-2">

            <span className="text-blue-600 font-semibold">
              Uploading...
            </span>

            <span className="font-semibold">
              {progress}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>
      )}

      {preview && !uploading && (
        <div className="mt-2">

          <p className="text-green-600 font-semibold mb-3">
            ✅ Document Uploaded Successfully
          </p>

          <img
            src={preview}
            alt={title}
            className="w-full max-w-md max-h-80 object-contain rounded-xl border"
          />

          <button
            type="button"
            onClick={removeImage}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
          >
            Remove Image
          </button>

        </div>
      )}

      {error && (
        <div className="mt-2 bg-red-50 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      {!uploading &&
        !preview &&
        status && (
          <p className="mt-2 text-green-600 font-semibold">
            {status}
          </p>
        )}

    </div>
  );
}

export default DocumentUploader;