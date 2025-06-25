import { UploadCloud } from "lucide-react";

export function UploadWidgetTitle() {
  return(
    
    <div className="text-sm font-medium flex items-center gap-1.5">
      <UploadCloud className="size-6  text-zinc-400 "strokeWidth={1.5}/>
      <span>Upload files</span>
    </div>
  )
}