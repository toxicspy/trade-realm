import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MobileScrollableDatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  initialDate?: string;
}

export function MobileScrollableDatePicker({
  isOpen,
  onClose,
  onDateSelect,
  initialDate,
}: MobileScrollableDatePickerProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const dayScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Initialize from passed date
  useEffect(() => {
    if (initialDate) {
      try {
        const date = new Date(initialDate);
        setSelectedDay(date.getDate());
        setSelectedMonth(date.getMonth());
        setSelectedYear(date.getFullYear());
      } catch (e) {
        console.warn("Invalid date:", initialDate);
      }
    }
  }, [initialDate, isOpen]);

  // Snap to nearest item after scroll
  const handleScrollStop = (
    scrollRef: React.RefObject<HTMLDivElement>,
    itemHeight: number,
    setSelected: (val: number) => void,
    values: number[]
  ) => {
    if (!scrollRef.current) return;

    const scrollTop = scrollRef.current.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    const snappedIndex = Math.max(0, Math.min(selectedIndex, values.length - 1));

    setSelected(values[snappedIndex]);
    scrollRef.current.scrollTop = snappedIndex * itemHeight;
  };

  const handleConfirm = () => {
    // Format as YYYY-MM-DD
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    onDateSelect(dateStr);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        data-testid="mobile-date-picker-backdrop"
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-lg z-50 max-h-[80vh] flex flex-col"
        data-testid="mobile-date-picker-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-date-picker"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scroll Picker Container */}
        <div className="flex-1 flex overflow-hidden px-4 py-6 gap-2">
          {/* Day Column */}
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-semibold text-muted-foreground mb-2 text-center">
              Day
            </label>
            <div
              ref={dayScrollRef}
              className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
              onScrollCapture={(e) => {
                const itemHeight = 44;
                const scrollTop = (e.target as HTMLDivElement).scrollTop;
                const index = Math.round(scrollTop / itemHeight);
                const snapped = Math.max(0, Math.min(index, days.length - 1));
                setSelectedDay(days[snapped]);
              }}
              data-testid="scroll-day"
            >
              <div className="h-44" /> {/* Top padding */}
              {days.map((day) => (
                <div
                  key={day}
                  className={`h-11 flex items-center justify-center snap-center text-lg font-medium cursor-pointer transition-opacity ${
                    selectedDay === day
                      ? "text-primary font-bold"
                      : "text-muted-foreground opacity-40"
                  }`}
                  onClick={() => {
                    setSelectedDay(day);
                    if (dayScrollRef.current) {
                      dayScrollRef.current.scrollTop = (day - 1) * 44;
                    }
                  }}
                  data-testid={`day-${day}`}
                >
                  {day}
                </div>
              ))}
              <div className="h-44" /> {/* Bottom padding */}
            </div>
          </div>

          {/* Month Column */}
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-semibold text-muted-foreground mb-2 text-center">
              Month
            </label>
            <div
              ref={monthScrollRef}
              className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
              onScrollCapture={(e) => {
                const itemHeight = 44;
                const scrollTop = (e.target as HTMLDivElement).scrollTop;
                const index = Math.round(scrollTop / itemHeight);
                const snapped = Math.max(0, Math.min(index, months.length - 1));
                setSelectedMonth(snapped);
              }}
              data-testid="scroll-month"
            >
              <div className="h-44" /> {/* Top padding */}
              {months.map((month, idx) => (
                <div
                  key={month}
                  className={`h-11 flex items-center justify-center snap-center text-lg font-medium cursor-pointer transition-opacity truncate px-1 ${
                    selectedMonth === idx
                      ? "text-primary font-bold"
                      : "text-muted-foreground opacity-40"
                  }`}
                  onClick={() => {
                    setSelectedMonth(idx);
                    if (monthScrollRef.current) {
                      monthScrollRef.current.scrollTop = idx * 44;
                    }
                  }}
                  data-testid={`month-${month}`}
                >
                  {month}
                </div>
              ))}
              <div className="h-44" /> {/* Bottom padding */}
            </div>
          </div>

          {/* Year Column */}
          <div className="flex-1 flex flex-col">
            <label className="text-xs font-semibold text-muted-foreground mb-2 text-center">
              Year
            </label>
            <div
              ref={yearScrollRef}
              className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
              onScrollCapture={(e) => {
                const itemHeight = 44;
                const scrollTop = (e.target as HTMLDivElement).scrollTop;
                const index = Math.round(scrollTop / itemHeight);
                const snapped = Math.max(0, Math.min(index, years.length - 1));
                setSelectedYear(years[snapped]);
              }}
              data-testid="scroll-year"
            >
              <div className="h-44" /> {/* Top padding */}
              {years.map((year) => (
                <div
                  key={year}
                  className={`h-11 flex items-center justify-center snap-center text-lg font-medium cursor-pointer transition-opacity ${
                    selectedYear === year
                      ? "text-primary font-bold"
                      : "text-muted-foreground opacity-40"
                  }`}
                  onClick={() => {
                    setSelectedYear(year);
                    if (yearScrollRef.current) {
                      yearScrollRef.current.scrollTop =
                        (year - years[0]) * 44;
                    }
                  }}
                  data-testid={`year-${year}`}
                >
                  {year}
                </div>
              ))}
              <div className="h-44" /> {/* Bottom padding */}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-date-picker"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            data-testid="button-confirm-date-picker"
          >
            Confirm
          </Button>
        </div>
      </div>

      {/* Hide scrollbar globally for picker scrolls */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
