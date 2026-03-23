import { useCallback, useEffect, useMemo, useState } from 'react';

export const useAvatarFilePicker = () => {
  const [file, setFile] = useState<File | null>(null);

  const preview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (!preview) return;
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  }, []);

  const clear = useCallback((input?: HTMLInputElement | null) => {
    setFile(null);

    if (input) {
      input.value = '';
    }
  }, []);

  return {
    file,
    preview,
    onChange,
    clear,
  };
};
