import Input, { type InputProps } from '../Input';
import * as React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.css';

export type SearchInputProps = Omit<InputProps, 'type' | 'leftSlot' | 'rightSlot' | 'onChange'> & {
  onChange?: (value: string) => void;
};

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    const { value, onChange, ...rest } = props;

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
        className={styles.searchInput}
        ref={ref}
        value={value}
        onChange={handleChange}
        leftSlot={<Search className={styles.searchIcon} />}
        rightSlot={
          value && (
            <button className={styles.clearBtn} type={'button'} onClick={handleClear}>
              <X className={styles.clearIcon} />
            </button>
          )
        }
        bordered={false}
        type={'search'}
      />
    );
  },
);

export default SearchInput;
