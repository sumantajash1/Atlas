import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

export interface CategorySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  categoryOptions: { label: string; value: string }[];
}

export function CategorySelect({
  value,
  onChange,
  className,
  categoryOptions,
}: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categoryOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
