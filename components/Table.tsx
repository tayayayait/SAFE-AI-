import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export const Table = <T,>({ data, columns, keyExtractor, onRowClick, isLoading }: TableProps<T>) => {
  if (isLoading) {
    return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-text-secondary">No data available</div>;
  }

  return (
    <div className="w-full overflow-x-auto border border-border-default rounded-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-border-default text-sm font-bold text-text-primary">
            {columns.map((col, idx) => (
              <th key={idx} className={`p-3 ${col.className || ''}`} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr 
              key={keyExtractor(item)} 
              onClick={() => onRowClick && onRowClick(item)}
              className={`
                border-b border-border-default last:border-none text-sm text-text-primary transition-colors
                ${rowIdx % 2 !== 0 ? 'bg-[#FCFCFC]' : 'bg-white'}
                ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}
              `}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="p-3">
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <Button 
        variant="secondary" 
        size="sm" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-text-secondary">
        Page <span className="font-bold text-text-primary">{currentPage}</span> of {totalPages}
      </span>
      <Button 
        variant="secondary" 
        size="sm" 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};