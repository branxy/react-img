import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderSearch, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type RefObject,
  useRef,
  useState,
} from "react"

export type UniversalNetworkResponseWithData<T> = Promise<
  | { success: true; data: T; message: null }
  | { success: false; data: null; message: string }
>

interface BaseProps {
  initialFileURL: string
  acceptedFileTypes: NonNullable<
    InputHTMLAttributes<HTMLInputElement>["accept"]
  >
  getNewFileURLOnFileSelect: (
    e: ChangeEvent<HTMLInputElement>,
    prevFileURL: string
  ) => UniversalNetworkResponseWithData<string>
}

interface ImageProps extends BaseProps {
  category: "image"
  alt?: string
  previewSize: 240 | 300 | 400
}

interface AudioProps extends BaseProps {
  category: "audio"
}

type FileUploadProps = AudioProps | ImageProps

type FileUpdateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success" }

export const FileUploadInput = (props: FileUploadProps) => {
  const [currentURL, setCurrentURL] = useState<string | null>(null)
  const [fileState, setFileState] = useState<FileUpdateState>({
    status: "idle",
  })
  const filePickerRef = useRef<HTMLInputElement>(null)

  const {
    category,
    initialFileURL,
    acceptedFileTypes,
    getNewFileURLOnFileSelect,
  } = props

  let alt = undefined
  let imgSize = undefined
  if (category === "image") {
    alt = props.alt
    imgSize = props.previewSize
  }

  const onNewFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return

    setFileState({ status: "loading" })

    const {
      success,
      message,
      data: uploadedFileURL,
    } = await getNewFileURLOnFileSelect(e, currentURL ?? initialFileURL ?? null)
    if (!success) {
      setFileState({ status: "error", error: message })
      return
    }

    setCurrentURL(uploadedFileURL)
    setFileState({ status: "success" })
  }

  return (
    <div className="flex flex-col">
      <FilePreview
        initialFileURL={initialFileURL}
        currentURL={currentURL}
        alt={alt}
        imgSize={imgSize}
        category={category}
        fileUpdateState={fileState}
        filePickerRef={filePickerRef}
      />
      {fileState.status === "error" && (
        <div className="flex items-center gap-2 mt-4 mx-auto">
          <TriangleAlert className="text-red-300" />
          <span className="text-red-300">{fileState.error}</span>
        </div>
      )}
      <Input
        type="file"
        ref={filePickerRef}
        accept={acceptedFileTypes}
        onChange={onNewFileSelect}
        className={cn("h-12 cursor-pointer border", initialFileURL && "hidden")}
      />
    </div>
  )
}

const FilePreview = ({
  initialFileURL,
  currentURL,
  alt,
  imgSize,
  category,
  fileUpdateState,
  filePickerRef,
}: {
  initialFileURL: FileUploadProps["initialFileURL"]
  currentURL: string | null
  alt: string | undefined
  imgSize: ImageProps["previewSize"] | undefined
  category: FileUploadProps["category"]
  fileUpdateState: FileUpdateState
  filePickerRef: RefObject<HTMLInputElement | null>
}) => {
  const imageShapeCN: Record<
    ImageProps["previewSize"],
    NonNullable<HTMLAttributes<HTMLDivElement>["className"]>
  > = {
    "300": "mx-auto size-48 @lg:size-[300px]",
    "240": "mx-auto size-48 @lg:size-[240px]",
    "400": "mx-auto size-100 @lg:size-[480px]",
  }

  const audioSkeletonCN = "w-[300px] h-[54px]"

  switch (category) {
    case "image":
      return (
        <div className="flex flex-col">
          {fileUpdateState.status === "loading" ? (
            <Skeleton className={imageShapeCN[imgSize ?? 300]} />
          ) : (
            <img
              src={currentURL ?? initialFileURL}
              alt={alt}
              width={imgSize}
              height={imgSize}
              className={cn(
                imageShapeCN,
                "object-contain border-2 border-neutral-700"
              )}
            />
          )}
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => filePickerRef.current?.click()}
            disabled={fileUpdateState.status === "loading"}
            className="mx-auto mt-4 min-w-48"
          >
            <FolderSearch />
          </Button>
        </div>
      )

    case "audio":
      return (
        <div className="flex items-center gap-2">
          {fileUpdateState.status === "loading" ? (
            <Skeleton className={audioSkeletonCN} />
          ) : (
            <audio src={currentURL ?? initialFileURL} controls />
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => filePickerRef.current?.click()}
            disabled={fileUpdateState.status === "loading"}
          >
            <FolderSearch />
          </Button>
        </div>
      )
    default:
      throw Error("Failed to render FilePreview: unexpected 'category' value.")
  }
}
