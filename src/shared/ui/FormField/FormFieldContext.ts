import { createContext } from 'react';

interface FormFieldContextValue {
  fieldId: string;
  fieldError: string;
}

export const FormFieldContext = createContext<FormFieldContextValue>({
  fieldId: '',
  fieldError: '',
});
