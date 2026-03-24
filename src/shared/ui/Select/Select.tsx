import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import chevronDownUrl from '@/assets/chevron-down.svg';
import styles from './Select.module.css';

export type SelectOption<T = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type SelectProps<T> = {
  options: SelectOption<T>[];
  size?: 'short' | 'standard' | 'long';
  label?: string;
  labelClassName?: string;
  triggerClassName?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  unknownValuePlaceholder?: string;
  disabled?: boolean;
  error?: string;
  name?: string;
  id?: string;
  className?: string;
  valueClassName?: string;
};

const getFirstEnabledOptionIndex = <T,>(options: SelectOption<T>[]): number =>
  options.findIndex((option) => !option.disabled);

const getNextEnabledIndex = <T,>(
  options: SelectOption<T>[],
  currentIndex: number,
  direction: 1 | -1,
): number => {
  if (options.length === 0) {
    return -1;
  }

  let index = currentIndex;
  for (let attempt = 0; attempt < options.length; attempt += 1) {
    index = (index + direction + options.length) % options.length;
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

export const Select = <T,>({
  options,
  size = 'standard',
  label,
  labelClassName,
  triggerClassName,
  value,
  defaultValue,
  onChange,
  placeholder = 'Выберите значение',
  unknownValuePlaceholder = 'Значение не найдено',
  disabled = false,
  error,
  name,
  id,
  className,
  valueClassName,
}: SelectProps<T>) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const errorId = `${selectId}-error`;

  const rootRef = useRef<HTMLDivElement>(null);

  const selectedValue = isControlled ? value : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue],
  );

  const isUnknownControlledValue = isControlled && value !== undefined && !selectedOption;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const shouldReset =
      internalValue !== undefined && !options.some((option) => option.value === internalValue);

    if (shouldReset) {
      const timeoutId = setTimeout(() => {
        setInternalValue(undefined);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isControlled, internalValue, options]);

  useEffect(() => {
    if (disabled && isOpen) {
      const timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    if (!isOpen || disabled) {
      return;
    }

    const handlePointerDownOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
    };
  }, [disabled, isOpen]);

  const updateValue = (nextValue: T) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const openList = () => {
    if (disabled || options.length === 0) {
      return;
    }

    const selectedIndex = selectedOption
      ? options.findIndex((option) => option.value === selectedOption.value)
      : -1;
    const startIndex = selectedIndex >= 0 ? selectedIndex : getFirstEnabledOptionIndex(options);

    setActiveIndex(startIndex);
    setIsOpen(true);
  };

  const closeList = () => {
    setIsOpen(false);
  };

  const toggleList = () => {
    if (isOpen) {
      closeList();
      return;
    }

    openList();
  };

  const selectOption = (option: SelectOption<T>) => {
    if (option.disabled) {
      return;
    }

    updateValue(option.value);
    closeList();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'Tab') {
      closeList();
      return;
    }

    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        closeList();
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!isOpen) {
        openList();
        return;
      }

      const direction: 1 | -1 = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((prev) => {
        const baseIndex = prev >= 0 ? prev : getFirstEnabledOptionIndex(options);
        return getNextEnabledIndex(options, baseIndex, direction);
      });

      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!isOpen) {
        openList();
        return;
      }

      if (activeIndex >= 0 && options[activeIndex] && !options[activeIndex].disabled) {
        selectOption(options[activeIndex]);
      } else {
        closeList();
      }
    }
  };

  const triggerLabel = selectedOption
    ? selectedOption.label
    : isUnknownControlledValue
      ? unknownValuePlaceholder
      : placeholder;

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, styles[`size_${size}`], isOpen && styles.rootOpen, className)}
    >
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedOption ? String(selectedOption.value) : ''}
        />
      ) : null}

      {label ? (
        <label className={clsx(styles.label, labelClassName)} htmlFor={selectId}>
          {label}
        </label>
      ) : null}

      <div className={styles.field}>
        <button
          id={selectId}
          type="button"
          role="combobox"
          className={clsx(
            styles.trigger,
            triggerClassName,
            isOpen && styles.triggerOpen,
            disabled && styles.triggerDisabled,
            error && styles.triggerError,
          )}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={toggleList}
          onKeyDown={handleTriggerKeyDown}
        >
          <span
            className={clsx(
              styles.value,
              valueClassName,
              !selectedOption && !isUnknownControlledValue && styles.valuePlaceholder,
            )}
          >
            {triggerLabel}
          </span>
          <span className={clsx(styles.chevron, isOpen && styles.chevronOpen)} aria-hidden="true">
            <img src={chevronDownUrl} alt="" className={styles.chevronIcon} />
          </span>
        </button>

        {isOpen && (
          <div id={listboxId} role="listbox" className={styles.listbox} aria-labelledby={selectId}>
            {options.map((option, index) => {
              const isSelected = selectedOption?.value === option.value;
              const isActive = activeIndex === index;

              return (
                <button
                  id={`${selectId}-option-${index}`}
                  key={String(option.value)}
                  type="button"
                  role="option"
                  className={clsx(
                    styles.option,
                    isSelected && styles.optionSelected,
                    isActive && styles.optionActive,
                  )}
                  aria-selected={isSelected}
                  aria-disabled={Boolean(option.disabled)}
                  disabled={option.disabled}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
