import DatePicker, { registerLocale } from 'react-datepicker';
import React, { useState } from 'react';
import type { MiddlewareState } from '@floating-ui/react-dom';
import { CalendarDays } from 'lucide-react';
import { ru } from 'date-fns/locale/ru';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button/Button.tsx';
import styles from './Datepicker.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import './react-datepicker.css';
import { convertStringToDate } from '@/shared/lib/date/convertStringToDate.ts';
import { convertDateToString } from '@/shared/lib/date/convertDateToString.ts';

export interface DatepickerProps {
  value: string | '';
  onChange?: (date: string) => void;
}

registerLocale('ru', ru);

const Datepicker: React.FC<DatepickerProps> = ({ value, onChange }) => {
  const [tempDate, setTempDate] = useState<Date | null>(convertStringToDate(value));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleChange = (date: Date | null) => {
    setTempDate(date);
  };

  const handleCalendarClose = () => {
    setTempDate(convertStringToDate(value));
    setIsOpen(false);
  };

  const handleCalendarOpen = () => {
    setTempDate(convertStringToDate(value));
    setIsOpen(true);
  };

  const handleCancel = () => {
    if (onChange) onChange(value);
    setTempDate(convertStringToDate(value));
    setIsOpen(false);
  };

  const handleApply = () => {
    if (onChange) {
      if (tempDate) {
        onChange(convertDateToString(tempDate));
      } else {
        onChange(value);
      }
    }
    setIsOpen(false);
  };

  return (
    <DatePicker
      selected={tempDate}
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
      onCalendarClose={handleCalendarClose}
      onCalendarOpen={handleCalendarOpen}
    />
  );
};

export default Datepicker;
