"use client";

import React from "react";
import Image from "next/image";
import { Text } from "pakt-ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ColumnDef, PaginationState, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination } from "./pagination";
import { Spinner } from "./loader";

interface TableProps<T extends Record<string, any>> {
    data?: T[];
    columns: ColumnDef<T>[];
    pagination?: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    pageCount: number;
    emptyStateMessage?: string;
    loading?: boolean;
}

export const Table = <T extends object>({
    data = [],
    columns,
    pagination,
    pageCount,
    setPagination,
    emptyStateMessage,
    loading,
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
        console.log(page);
        setPagination((prev) => {
            console.log({ ...prev, pageIndex: page });
            return { ...prev, pageIndex: page };
        });
    };

    if (loading) {
        return (
            <div className="flex h-full min-h-[450px] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!loading && data.length === 0) {
        return (
            <div className="flex min-h-[450px] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="max-w-[100px]">
                        <Image src="/images/empty-table.svg" width={200} height={200} alt="" />
                    </div>
                    <Text.h3 size="xs" className="text-center font-normal text-[#6C757D]">
                        {emptyStateMessage || "Table Content Will Appear Here"}
                    </Text.h3>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-8">
            <div className="mt-4 flow-root h-full">
                <div className="-mx-4 -my-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                        <div className="h-full max-h-[450px] min-w-full overflow-y-auto overflow-x-hidden border border-line sm:rounded-lg">
                            <table className="min-w-full table-fixed">
                                <thead className="sticky top-0 z-10 bg-[#F7F7F7]">
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
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext(),
                                                          )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                {
                                    <tbody className="divide-y divide-line border-t border-line">
                                        {table.getRowModel().rows.map((row) => {
                                            return (
                                                <tr key={row.id} className="hover:bg-app relative duration-200">
                                                    {row.getVisibleCells().map((cell) => {
                                                        return (
                                                            <td
                                                                key={cell.id}
                                                                className="w-fit text-base text-[#787389]"
                                                            >
                                                                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap px-3 py-2">
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext(),
                                                                    )}
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
                    <Pagination
                        totalPages={pageCount}
                        currentPage={pagination.pageIndex}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};
