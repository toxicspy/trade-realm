import { ReactNode } from 'react';
import { useGlobalCalendar } from '@/hooks/use-global-calendar';
import { MobileScrollableCalendar } from '@/components/MobileScrollableCalendar';

export function GlobalCalendarProvider({ children }: { children: ReactNode }) {
  const calendar = useGlobalCalendar();

  return (
    <>
      {children}
      <MobileScrollableCalendar
        isOpen={calendar.isOpen}
        onClose={calendar.closeCalendar}
        onDateSelect={calendar.selectDate}
        initialDate={calendar.initialDate}
      />
    </>
  );
}
