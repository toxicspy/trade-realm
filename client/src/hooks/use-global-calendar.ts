import { useState, useCallback, useEffect } from 'react';

interface GlobalCalendarState {
  isOpen: boolean;
  initialDate?: string;
  targetInput: HTMLInputElement | null;
}

export function useGlobalCalendar() {
  const [state, setState] = useState<GlobalCalendarState>({
    isOpen: false,
    targetInput: null,
  });

  const openCalendar = useCallback((input: HTMLInputElement) => {
    const currentValue = input.value || undefined;
    setState({
      isOpen: true,
      initialDate: currentValue,
      targetInput: input,
    });
    // Prevent body scroll when calendar is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCalendar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
    // Restore body scroll
    document.body.style.overflow = '';
  }, []);

  const selectDate = useCallback((dateStr: string) => {
    if (state.targetInput) {
      state.targetInput.value = dateStr;
      // Trigger input event to notify React and any listeners
      const event = new Event('input', { bubbles: true });
      state.targetInput.dispatchEvent(event);
      const changeEvent = new Event('change', { bubbles: true });
      state.targetInput.dispatchEvent(changeEvent);
    }
    closeCalendar();
  }, [state.targetInput, closeCalendar]);

  // Set up global event listeners
  useEffect(() => {
    const handleDateInputFocus = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'date' || target.dataset.mobileCalendar === 'true') {
        // Check if we're on mobile
        const isMobile = window.innerWidth < 768 || window.matchMedia('(hover: none)').matches;
        if (isMobile) {
          e.preventDefault();
          openCalendar(target);
        }
      }
    };

    // Listen for focus events on all date inputs
    document.addEventListener('focus', handleDateInputFocus, true);

    // Also handle click events for maximum compatibility
    const handleDateInputClick = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'date' || target.dataset.mobileCalendar === 'true') {
        const isMobile = window.innerWidth < 768 || window.matchMedia('(hover: none)').matches;
        if (isMobile) {
          e.preventDefault();
          openCalendar(target);
        }
      }
    };

    document.addEventListener('click', handleDateInputClick, true);

    return () => {
      document.removeEventListener('focus', handleDateInputFocus, true);
      document.removeEventListener('click', handleDateInputClick, true);
    };
  }, [openCalendar]);

  return {
    ...state,
    openCalendar,
    closeCalendar,
    selectDate,
  };
}
