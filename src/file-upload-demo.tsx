import { FileUploadInput } from "@/file-upload-input"

import {
  deleteOldImageFromStorage,
  uploadNewImageToStorage,
  validateFiles,
} from "@/lib/utils"
import { allowedImageUploadExtensions, demoImageUrls } from "@/lib/constants"
import { useState } from "react"

export const Demo = () => {
  const [images] = useState(demoImageUrls)

  return (
    <div className="flex items-start gap-4">
      {images.map(({ url }) => (
        <FileUploadInput
          key={url}
          category="image"
          initialFileURL={url}
          previewSize={400}
          acceptedFileTypes={allowedImageUploadExtensions.join(", ")}
          getNewFileURLOnFileSelect={async (e, prevFileURL) => {
            const { ok, message } = validateFiles(e.target.files)
            if (!ok) return { success: false, data: null, message }

            await deleteOldImageFromStorage(prevFileURL)

            return uploadNewImageToStorage(e.target.files![0])
          }}
        />
      ))}
    </div>
  )
}
