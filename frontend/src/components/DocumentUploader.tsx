import { useRef, useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState("");

  const [uploading, setUploading] = useState(false);

  const [progressText, setProgressText] =
    useState("");


  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (
    file: File
  ) => {
    try {
      setUploading(true);

      setProgressText("Uploading...");

      const fileName =
        Date.now() + "_" + file.name;

      const storageRef = ref(
        storage,
        `${folder}/${fileName}`
      );

      await uploadBytes(storageRef, file);

      const url =
        await getDownloadURL(storageRef);

      setPreview(url);

      onUploaded(url);

      setProgressText("Upload Complete");

      setUploading(false);
    } catch (error) {
      console.error(error);

      setUploading(false);

      setProgressText("Upload Failed");
    }
  };

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await uploadFile(file);
  };

  return (
    <div className="border rounded-2xl p-6 bg-white shadow mb-6">

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-xl font-bold">
            {title}
          </h3>

          <p className="text-gray-500 mt-1">
            Take Photo or Upload Image
          </p>

        </div>

        <button
          onClick={chooseFile}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
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
            {preview && (
        <div className="mt-6">

          <img
            src={preview}
            alt={title}
            className="w-full max-w-md rounded-xl border"
          />

          <button
            onClick={() => {
              setPreview("");
              onUploaded("");
              setProgressText("");
            }}
            className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl"
          >
            Remove Image
          </button>

        </div>
      )}

      {uploading && (
        <p className="mt-4 text-blue-600 font-semibold">
          Uploading...
        </p>
      )}

      {!uploading && progressText !== "" && (
        <p className="mt-4 text-green-600 font-semibold">
          {progressText}
        </p>
      )}

    </div>
  );
}

export default DocumentUploader;