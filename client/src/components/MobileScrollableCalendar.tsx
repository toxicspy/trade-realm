import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfToday } from "date-fns";

interface MobileScrollableCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  initialDate?: string;
}

export function MobileScrollableCalendar({
  isOpen,
  onClose,
  onDateSelect,
  initialDate,
}: MobileScrollableCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate ? new Date(initialDate) : startOfToday()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialDate ? new Date(initialDate) : startOfToday()
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const startScrollRef = useRef<number>(0);

  const today = startOfToday();

  // Get days for current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // Get padding days (empty cells before month starts)
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const allDisplayDays = [...paddingDays, ...daysInMonth];

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    if (scrollContainerRef.current) {
      startScrollRef.current = scrollContainerRef.current.scrollTop;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const diffX = touchStartRef.current.x - touchEnd.x;
    const diffY = touchStartRef.current.y - touchEnd.y;

    // Swipe down to close
    if (diffY < -50) {
      onClose();
      return;
    }

    // Swipe left to next month
    if (diffX > 50) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }

    // Swipe right to previous month
    if (diffX < -50) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }

    touchStartRef.current = null;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, "yyyy-MM-dd");
    onDateSelect(dateStr);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  if (!isOpen) return null;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        data-testid="mobile-calendar-backdrop"
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-lg z-50 max-h-[90vh] flex flex-col shadow-xl"
        data-testid="mobile-calendar-modal"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with Month Navigation */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-calendar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between px-4 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              data-testid="button-prev-month"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Swipe left/right to change month
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              data-testid="button-next-month"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4" ref={scrollContainerRef}>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4 sticky top-0 bg-background z-5">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {allDisplayDays.map((day, idx) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="aspect-square"
                    data-testid={`empty-cell-${idx}`}
                  />
                );
              }

              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameDay(day.getMonth(), currentMonth.getMonth());

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    transition-all duration-200
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : isToday
                          ? "bg-primary/20 text-primary border border-primary/50"
                          : "text-foreground hover:bg-muted/50"
                    }
                    ${!isCurrentMonth ? "opacity-30" : ""}
                  `}
                  data-testid={`date-${format(day, "yyyy-MM-dd")}`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div className="mt-6 mb-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentMonth(today);
                handleDateSelect(today);
              }}
              className="w-full text-xs"
              data-testid="button-today"
            >
              Today
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 p-4 border-t border-border bg-background">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-calendar"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const dateStr = format(selectedDate, "yyyy-MM-dd");
              onDateSelect(dateStr);
            }}
            className="flex-1"
            data-testid="button-confirm-calendar"
          >
            Confirm
          </Button>
        </div>
      </div>

      {/* Swipe hint */}
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
