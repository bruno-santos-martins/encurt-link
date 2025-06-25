import { useState } from "react";
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";
import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";

export function UploadWidget(){
  const [ isWidgetOpen,setIsWidgetOpen] = useState(false);
  return (
    <Collapsible.Root onOpenChange={setIsWidgetOpen} open={isWidgetOpen} className="w-full max-w-[400px]">
      <div className="bg-zinc-900 overflow-hidden rounded-xl shadow-shape text-white" >
        { !isWidgetOpen && <UploadWidgetMinimizedButton/>}
        <Collapsible.Content>
          <UploadWidgetHeader />
          <div className="flex flex-col gap-4 py-3  bg-zinc-800">
            <UploadWidgetDropzone />
            <div className="h-px bg-zinc-800 border-t-2 border-black/50 box-content" />

            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  )
}
