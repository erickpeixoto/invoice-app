// GenericCalendar.tsx
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface GenericCalendarProps {
  label?: string;
  description?: string;
  name: string;
  placeholder?: string;
  value?: Date | null;
}
export const GenericCalendar = ({
  label,
  description,
  name,
  placeholder,
  value = null,
}: GenericCalendarProps) => {
  const { register, setValue } = useFormContext();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value);

  React.useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setValue(name, date);
    }
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !selectedDate && "text-muted-foreground",
              )}
            >
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>{placeholder ?? "Pick a date"} </span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate!}
            onSelect={handleDateChange}
            {...register(name)}
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
