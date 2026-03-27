export interface AuthRedirectLocationState {
  from?: string;
}

export const buildRedirectPath = ({
  pathname,
  search,
  hash,
}: {
  pathname: string;
  search?: string;
  hash?: string;
}) => `${pathname}${search ?? ''}${hash ?? ''}`;
