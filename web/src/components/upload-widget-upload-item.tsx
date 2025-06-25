import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from 'radix-ui';

export function UploadWidgetUploadItem() {
  return (
    <div className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden">
      <div className="flex flex-col gap-1">
        <span className="flex text-xs font-medium items-center gap-2">
          <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5}/>
          screenshop.png
        </span>
        <div className="text-sm text-zinc-400 flex gap-1.5 items-center">
          <span className="line-through">3MB</span>
          <div className="size-1 rounded-full bg-zinc-700"></div>
          <span>
            300KB
            <span className="text-green-400 ml-1"> -94% </span>
          </span>
          <div className="size-1 rounded-full bg-zinc-700"></div>
          <span> 45% </span>
        </div>
      </div>

      <Progress.Root className="bg-zinc-800 rounded-full h-2 overflow-hidden">
        <Progress.Indicator
          className="bg-indigo-500 h-2"
          style={{ width: '53%' }}
			  />
      </Progress.Root>
     
      
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        <Button size="icon-sm">
          <Download className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button size="icon-sm">
          <Link2 className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Copy remote URL</span>
        </Button>

        <Button size="icon-sm">
          <RefreshCcw className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button size="icon-sm">
          <X className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </div>
  )
}