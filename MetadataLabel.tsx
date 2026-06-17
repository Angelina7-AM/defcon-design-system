import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type MetadataLabelProps = HTMLAttributes<HTMLSpanElement>;

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Monospace, uppercase, tracked-out label for metadata (timestamps, IDs, keys). */
export const MetadataLabel = forwardRef<HTMLSpanElement, MetadataLabelProps>(
  function MetadataLabel({ className, ...rest }, ref) {
    return <span ref={ref} className={cx('dfc-metadata-label', className)} {...rest} />;
  },
);
