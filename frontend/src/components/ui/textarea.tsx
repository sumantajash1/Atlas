import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  const [filled, setFilled] = React.useState(Boolean(props.value || ""));

  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        filled && "bg-slate-800",
        className
      )}
      onChange={e => {
        setFilled(Boolean(e.target.value));
        if (props.onChange) props.onChange(e);
      }}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea }; 