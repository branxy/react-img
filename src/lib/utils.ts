import type { UniversalNetworkResponseWithData } from "@/file-upload-input"
import { allowedImageUploadExtensions } from "@/lib/constants"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FnResponse = { ok: true; message: null } | { ok: false; message: string }

export const validateFiles = (files: FileList | null): FnResponse => {
  if (!files)
    return {
      ok: false,
      message: "Файл не выбран.",
    }
  const file = files[0]

  if (!allowedImageUploadExtensions.includes("." + file.name.split(".")[1]))
    return {
      ok: false,
      message: "Некорректный формат файла.",
    }

  return { ok: true, message: null }
}

export const deleteOldImageFromStorage = async (url: string) => {
  return url && true
}

export const uploadNewImageToStorage = async (
  file: File
): UniversalNetworkResponseWithData<string> => {
  await new Promise((r) => setTimeout(r, 2400))

  // Return new image url
  return {
    success: true,
    message: null,
    data: URL.createObjectURL(file),
  }
}
