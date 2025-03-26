"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    selected?: Date;
    onSelect?: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
    className?: string;
};

function Calendar({ selected, onSelect, disabled, className }: CalendarProps) {
    return (
        <DayPicker
            mode="single"
            selected={selected}
            onSelect={onSelect}
            disabled={disabled}
            className={className}
            footer={
                selected
                    ? `Selected: ${selected.toLocaleDateString()}`
                    : "Pick a day."
            }
        />
    );
}

Calendar.displayName = "Calendar";

export { Calendar };
