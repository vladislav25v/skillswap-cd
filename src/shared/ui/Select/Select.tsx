import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import chevronDownUrl from '@/assets/chevron-down.svg';
import { Checkbox } from '../Checkbox';
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
  value?: T | T[];
  defaultValue?: T | T[];
  onChange?: (value: T | T[]) => void;
  placeholder?: string;
  unknownValuePlaceholder?: string;
  disabled?: boolean;
  error?: string;
  name?: string;
  id?: string;
  className?: string;
  valueClassName?: string;
  multiple?: boolean;
  maxDisplayItems?: number;
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
  multiple = false,
  maxDisplayItems = 2,
}: SelectProps<T>) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const errorId = `${selectId}-error`;

  const rootRef = useRef<HTMLDivElement>(null);

  const selectedValue = isControlled ? value : internalValue;

  const isValueSelected = (optionValue: T): boolean => {
    if (!multiple) {
      return selectedValue === optionValue;
    }
    return Array.isArray(selectedValue) && selectedValue.includes(optionValue);
  };

  const selectedOptions = useMemo(() => {
    if (!multiple) {
      const option = options.find((opt) => opt.value === selectedValue);
      return option ? [option] : [];
    }
    if (Array.isArray(selectedValue)) {
      return options.filter((opt) => selectedValue.includes(opt.value));
    }
    return [];
  }, [options, selectedValue, multiple]);

  const isUnknownControlledValue = useMemo(() => {
    if (!isControlled) return false;
    if (multiple && Array.isArray(value)) {
      return value.some((v) => !options.some((opt) => opt.value === v));
    }
    return !multiple && value !== undefined && !options.some((opt) => opt.value === value);
  }, [isControlled, value, options, multiple]);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    const shouldReset = (() => {
      if (!multiple && internalValue !== undefined) {
        return !options.some((option) => option.value === internalValue);
      }
      if (multiple && Array.isArray(internalValue)) {
        return internalValue.some((v) => !options.some((opt) => opt.value === v));
      }
      return false;
    })();

    if (shouldReset) {
      const timeoutId = setTimeout(() => {
        setInternalValue(multiple ? [] : undefined);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isControlled, internalValue, options, multiple]);

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

  const updateValue = (nextValue: T | T[]) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleSingleSelect = (optionValue: T) => {
    updateValue(optionValue);
    closeList();
  };

  const handleMultiSelect = (optionValue: T, checked: boolean) => {
    const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    updateValue(newValues);
  };

  const openList = () => {
    if (disabled || options.length === 0) {
      return;
    }

    let startIndex = -1;

    if (multiple && Array.isArray(selectedValue) && selectedValue.length > 0) {
      const firstSelectedIndex = options.findIndex((opt) => selectedValue.includes(opt.value));
      startIndex =
        firstSelectedIndex >= 0 ? firstSelectedIndex : getFirstEnabledOptionIndex(options);
    } else if (!multiple && selectedValue !== undefined) {
      const selectedIndex = options.findIndex((opt) => opt.value === selectedValue);
      startIndex = selectedIndex >= 0 ? selectedIndex : getFirstEnabledOptionIndex(options);
    } else {
      startIndex = getFirstEnabledOptionIndex(options);
    }

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
        if (multiple) {
          const option = options[activeIndex];
          const isSelected = isValueSelected(option.value);
          handleMultiSelect(option.value, !isSelected);
        } else {
          handleSingleSelect(options[activeIndex].value);
        }
      } else {
        closeList();
      }
    }
  };

  const getTriggerLabel = (): string => {
    if (multiple) {
      if (selectedOptions.length === 0) {
        return placeholder;
      }
      if (selectedOptions.length <= maxDisplayItems) {
        return selectedOptions.map((opt) => opt.label).join(', ');
      }
      return `${selectedOptions
        .slice(0, maxDisplayItems)
        .map((opt) => opt.label)
        .join(', ')} +${selectedOptions.length - maxDisplayItems}`;
    }

    if (selectedOptions.length === 0) {
      return isUnknownControlledValue ? unknownValuePlaceholder : placeholder;
    }

    return selectedOptions[0]?.label || placeholder;
  };

  const triggerLabel = getTriggerLabel();

  const getFormValue = (): string => {
    if (!multiple || !Array.isArray(selectedValue)) {
      return selectedValue !== undefined ? String(selectedValue) : '';
    }
    return selectedValue.join(',');
  };

  const handleOptionClick = (option: SelectOption<T>) => {
    if (option.disabled) return;

    if (multiple) {
      const isSelected = isValueSelected(option.value);
      handleMultiSelect(option.value, !isSelected);
    } else {
      handleSingleSelect(option.value);
    }
  };

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, styles[`size_${size}`], isOpen && styles.rootOpen, className)}
    >
      {name ? <input type="hidden" name={name} value={getFormValue()} /> : null}

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
              selectedOptions.length === 0 && styles.valuePlaceholder,
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
              const isSelected = isValueSelected(option.value);
              const isActive = activeIndex === index;

              if (multiple) {
                return (
                  <div
                    key={String(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    className={clsx(
                      styles.optionWrapper,
                      isActive && styles.optionActive,
                      option.disabled && styles.optionDisabled,
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleOptionClick(option)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={(checked) => handleMultiSelect(option.value, checked)}
                      label={option.label}
                      disabled={option.disabled}
                      id={`${selectId}-option-${index}`}
                      className={styles.checkboxOption}
                    />
                  </div>
                );
              }

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
                  onClick={() => handleSingleSelect(option.value)}
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
