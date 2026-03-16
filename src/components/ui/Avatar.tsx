import { cn, getInitials } from "@/utils";
import Image from "next/image";

interface AvatarProps {
  src?:  string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-full bg-slate-200 flex-shrink-0 ring-2 ring-white", sizes[size], className)}>
        <Image src={src} alt={name || "avatar"} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div className={cn("flex flex-shrink-0 items-center justify-center rounded-full bg-amber-100 border border-amber-200 font-semibold text-amber-700", sizes[size], className)}>
      {name ? getInitials(name) : "?"}
    </div>
  );
}