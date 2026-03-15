import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker.css';
import styles from './Datepicker.module.css';
import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import Input from '@/shared/ui/Input';
import { ru } from 'date-fns/locale/ru';
import type { MiddlewareState } from '@floating-ui/react-dom';
import Button from '@/shared/ui/Button/Button.tsx';

export interface DatepickerProps {
  value: Date | null;
  onChange?: (e: Date | null) => void;
}

registerLocale('ru', ru);

const Datepicker: React.FC<DatepickerProps> = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => value);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedDate(value);
  };

  const handleApply = () => {
    setIsOpen(false);

    if (onChange) onChange(selectedDate);
  };

  return (
    <DatePicker
      // openToDate - открыт на выбранной дате, посмотреть как работает
      selected={selectedDate}
      open={isOpen}
      locale={'ru'}
      maxDate={new Date()}
      placeholderText={'дд.мм.гггг'}
      dateFormat={'dd.MM.yyyy'}
      showPopperArrow={false}
      forceShowMonthNavigation={false}
      showMonthDropdown={true}
      showYearDropdown={true}
      dropdownMode="select"
      shouldCloseOnSelect={false}
      customInput={<Input rightSlot={<CalendarDays className={styles.icon} />} />}
      popperModifiers={[
        {
          name: 'myModifier',
          fn(state: MiddlewareState) {
            state.x = 0;
            state.y += 4;

            return state;
          },
        },
      ]}
      calendarContainer={({ children }) => {
        return (
          <div className={styles.container}>
            {children}

            <div className={styles.actions}>
              <Button variant={'secondary'} onClick={handleCancel}>
                Отменить
              </Button>
              <Button onClick={handleApply}>Выбрать</Button>
            </div>
          </div>
        );
      }}
      onChange={handleChange}
      onCalendarOpen={() => {
        setIsOpen(true);
      }}
      onCalendarClose={() => {
        setIsOpen(false);
      }}
    />
  );
};

export default Datepicker;
