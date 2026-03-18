import React, { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import SearchInput from '../SearchInput/SearchInput';
import styles from './SearchableSelect.module.css';

export interface SearchableOption {
  value: string;
  label: string;
  category?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SearchableOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  maxHeight?: number;
  noResultsText?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  defaultValue = '',
  onChange,
  onSearch,
  placeholder = 'Выберите значение',
  searchPlaceholder = 'Поиск...',
  label,
  error,
  disabled = false,
  required = false,
  name,
  id,
  className,
  maxHeight = 300,
  noResultsText = 'Ничего не найдено',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue],
  );

  // Фильтрация опций по поисковому запросу
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;

    const term = searchTerm.toLowerCase().trim();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) ||
        (option.category && option.category.toLowerCase().includes(term)),
    );
  }, [options, searchTerm]);

  // Группировка опций по категориям
  const groupedOptions = useMemo(() => {
    const groups: Record<string, SearchableOption[]> = {};

    filteredOptions.forEach((option) => {
      const category = option.category || 'Другое';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(option);
    });

    return groups;
  }, [filteredOptions]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Используем setTimeout для предотвращения каскадных рендеров
        setTimeout(() => {
          setSearchTerm('');
        }, 0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Исправляем эффект для сброса при закрытии
  useEffect(() => {
    if (!isOpen) {
      // Используем setTimeout для предотвращения каскадных рендеров
      const timeoutId = setTimeout(() => {
        setSearchTerm('');
        setActiveIndex(-1);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Скролл к активному элементу
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listboxRef.current) {
      const activeElement = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setSelectedValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          const option = filteredOptions[activeIndex];
          if (option && !option.disabled) {
            handleSelect(option.value);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.container,
        disabled && styles.disabled,
        error && styles.error,
        className,
      )}
    >
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <SearchInput
          ref={inputRef}
          value={isOpen ? searchTerm : selectedOption?.label || ''}
          onChange={handleSearchChange}
          placeholder={isOpen ? searchPlaceholder : placeholder}
          disabled={disabled}
          id={id}
          name={name}
          className={styles.searchInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul ref={listboxRef} className={styles.listbox} style={{ maxHeight }}>
            {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
              <li key={category} className={styles.categoryGroup}>
                <div className={styles.categoryTitle}>{category}</div>
                <ul className={styles.categoryList}>
                  {categoryOptions.map((option) => {
                    const globalIndex = filteredOptions.findIndex(
                      (opt) => opt.value === option.value,
                    );

                    return (
                      <li
                        key={option.value}
                        className={clsx(
                          styles.option,
                          option.value === currentValue && styles.selected,
                          activeIndex === globalIndex && styles.active,
                          option.disabled && styles.disabledOption,
                        )}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                      >
                        {option.label}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}

            {filteredOptions.length === 0 && <li className={styles.noResults}>{noResultsText}</li>}
          </ul>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
