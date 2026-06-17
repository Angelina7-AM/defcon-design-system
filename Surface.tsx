import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type SurfaceLevel = 0 | 1 | 2;

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Elevation level — maps to a layered off-black surface token. */
  level?: SurfaceLevel;
  /** Apply default internal padding. */
  padded?: boolean;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  { level = 1, padded = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        'dfc-surface',
        `dfc-surface--${level}`,
        padded && 'dfc-surface--pad',
        className,
      )}
      {...rest}
    />
  );
});
