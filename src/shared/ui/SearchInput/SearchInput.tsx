import Input, { type InputProps } from '../Input';
import * as React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.css';

export type SearchInputProps = Omit<InputProps, 'type' | 'leftSlot' | 'rightSlot'>;
// TODO: Доработать на использовать `onChange`, который будет принимать только value

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    const { value, onChange, ...rest } = props;

    const handleClear = () => {
      if (!onChange) return;

      // TODO: Вызов `onChange` c пустым значением
    };

    return (
      <Input
        {...rest}
        className={styles.searchInput}
        ref={ref}
        name={'searchField'}
        value={value}
        onChange={onChange}
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
