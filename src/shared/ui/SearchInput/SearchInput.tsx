import Input, { type InputProps } from '../Input';
import * as React from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';
import styles from './SearchInput.module.css';

export type SearchInputProps = Omit<InputProps, 'type' | 'leftSlot' | 'rightSlot' | 'onChange'> & {
  onChange?: (value: string) => void;
  className?: string;
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    const { value, onChange, className, ...rest } = props;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      onChange(e.target.value);
    };

    const handleClear = () => {
      if (!onChange) return;
      onChange('');
    };

    return (
      <Input
        {...rest}
        ref={ref}
        value={value}
        onChange={handleChange}
        bordered={false}
        type="search"
        className={clsx(styles.searchInput, className)}
        leftSlot={<Search className={styles.searchIcon} />}
        rightSlot={
          value && (
            <button
              className={styles.clearBtn}
              type="button"
              onClick={handleClear}
              aria-label="Очистить поиск"
            >
              <X className={styles.clearIcon} />
            </button>
          )
        }
      />
    );
  },
);

export default SearchInput;
