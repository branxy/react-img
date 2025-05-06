import { FileUploadInput } from "@/file-upload-input"

import {
  deleteOldImageFromStorage,
  uploadNewImageToStorage,
  validateFiles,
} from "@/lib/utils"
import { allowedImageUploadExtensions, demoImageUrl } from "@/lib/constants"

export const Demo = () => {
  return (
    <FileUploadInput
      category="image"
      initialFileURL={demoImageUrl}
      previewSize={400}
      acceptedFileTypes={allowedImageUploadExtensions.join(", ")}
      getNewFileURLOnFileSelect={async (e, prevFileURL) => {
        const { ok, message } = validateFiles(e.target.files)
        if (!ok) return { success: false, data: null, message }

        await deleteOldImageFromStorage(prevFileURL)

        return uploadNewImageToStorage(e.target.files![0])
      }}
    />
  )
}
