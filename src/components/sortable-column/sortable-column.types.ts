import type { BaseElementProps } from '@components';

export type SortOrder = 'asc' | 'desc';
export type SortableColumnProps = Omit<BaseElementProps<HTMLLIElement>, 'tag'>;
export type OnChangeHandler = ((order: SortOrder) => void) | null;
