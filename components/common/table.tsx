'use client';

import React from 'react';
import Image from 'next/image';
import { Text } from 'pakt-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ColumnDef, PaginationState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface TableProps<T extends Record<string, any>> {
  data?: T[];
  columns: ColumnDef<T>[];
  pagination?: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  pageCount: number;
  emptyStateMessage?: string;
}

export const Table = <T extends object>({
  data = [],
  columns,
  pagination,
  pageCount,
  setPagination,
  emptyStateMessage,
}: TableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    manualPagination: true,
    pageCount,

    onPaginationChange: setPagination,
  });

  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page }));
  };

  if (data.length === 0) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="max-w-[100px]">
            <Image src="/empty-table.svg" width={200} height={200} alt="" />
          </div>
          <Text.h3 size="xs" className="text-center font-normal text-[#6C757D]">
            {emptyStateMessage || 'Table Content Will Appear Here'}
          </Text.h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
            <div className="border-line h-full max-h-[450px] min-w-full overflow-y-auto overflow-x-hidden border sm:rounded-lg">
              <table className="min-w-full table-fixed">
                <thead className="sticky top-0 z-0 bg-[#F7F7F7]">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr className="bg-app" key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          scope="col"
                          className="px-3 py-4 text-left text-sm font-medium text-[#787389]"
                          key={header.id}
                          colSpan={header.colSpan}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                {
                  <tbody className="divide-line border-line divide-y border-t">
                    {table.getRowModel().rows.map((row) => {
                      return (
                        <tr key={row.id} className="hover:bg-app relative duration-200">
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <td key={cell.id} className="w-fit text-base text-[#787389]">
                                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap px-3 py-2">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {pagination && (
          <Pagination totalPages={pageCount} currentPage={pagination.pageIndex} setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
};

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  const BOUNDARY = 3;
  const MIN_PAGE = 1;
  const MAX_PAGE = Math.max(MIN_PAGE, totalPages);

  let leftPages: number[] = [];
  let rightPages: number[] = [];

  for (let i = Math.max(MIN_PAGE, currentPage - BOUNDARY); i < currentPage; i++) {
    leftPages.push(i);
  }

  for (let i = currentPage; i <= Math.min(MAX_PAGE, currentPage + BOUNDARY); i++) {
    rightPages.push(i);
  }

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div>
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {
          <button
            className="text-primary rounded-lg p-1 px-2 hover:bg-[#007C5B1A]"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft strokeWidth={1.5} size={20} />
          </button>
        }

        {leftPages.length > 0 &&
          leftPages.map((page) => (
            <button
              key={page}
              className="text-primary rounded-lg bg-white p-1 px-3 text-sm hover:bg-[#007C5B1A]"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {rightPages.length > 0 &&
          rightPages.map((page) => (
            <button
              key={page}
              className={`text-primary rounded-lg p-1  px-3 text-sm hover:bg-[#007C5B1A] ${
                currentPage === page ? 'bg-[#007C5B1A]' : 'bg-white'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {
          <button
            className="text-primary rounded-lg p-1 px-2 hover:bg-[#007C5B1A]"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight strokeWidth={1.5} size={20} />
          </button>
        }
      </div>
    </div>
  );
};
