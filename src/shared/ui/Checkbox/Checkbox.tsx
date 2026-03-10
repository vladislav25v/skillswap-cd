import React from 'react';

import styles from './Checkbox.module.css';

// Описываем типы пропсов, которые будет принимать компонент
interface CheckboxProps {
  /** Флаг: отмечен чекбокс или нет */
  checked: boolean;
  /** Функция, которая вызывается при изменении состояния */
  onChange: (checked: boolean) => void;
  /** Текст рядом с чекбоксом (необязательный) */
  label?: string;
  /** Можно ли взаимодействовать с чекбоксом (необязательный) */
  disabled?: boolean;
  /** Уникальный идентификатор для связи label и input (необязательный) */
  id?: string;
}

// Сам компонент
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false, // значение по умолчанию, если пропс не передан
  id,
}) => {
  // Обработчик изменения чекбокса
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Вызываем переданную функцию onChange с новым значением
    onChange(e.target.checked);
  };

  return (
    // label оборачивает весь компонент для удобства (клик по тексту тоже работает)
    <label htmlFor={id} className={`${styles.checkbox} ${disabled ? styles.disabled : ''}`}>
      {/* Сам инпут type="checkbox" */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />

      {/* Кастомный чекбокс (будем стилизовать через CSS) */}
      <span className={styles.customCheckbox}></span>

      {/* Если передан label — отображаем текст */}
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
