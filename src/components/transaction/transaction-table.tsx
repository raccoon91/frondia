import { FC } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionActions } from "./transaction-actions";
import { TransactionAmount } from "./transaction-amount";
import { TransactionCategorySelect } from "./transaction-category-select";
import { TransactionCheck } from "./transaction-check";
import { TransactionCurrencySelect } from "./transaction-currency-select";
import { TransactionDate } from "./transaction-date";
import { TransactionMemo } from "./transaction-memo";
import { TransactionTypeSelect } from "./transaction-type-select";

export const columns: ColumnDef<TransactionData>[] = [
  {
    id: "check",
    minSize: 40,
    maxSize: 40,
    cell: TransactionCheck,
  },
  {
    accessorKey: "date",
    header: "Date",
    minSize: 180,
    maxSize: 180,
    cell: TransactionDate,
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    minSize: 140,
    maxSize: 140,
    cell: TransactionTypeSelect,
  },
  {
    accessorKey: "category",
    header: "Category",
    minSize: 160,
    maxSize: 160,
    cell: TransactionCategorySelect,
  },
  {
    accessorKey: "memo",
    header: "Memo",
    cell: TransactionMemo,
  },
  {
    accessorKey: "currency",
    header: "Currency",
    minSize: 120,
    maxSize: 120,
    cell: TransactionCurrencySelect,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    minSize: 160,
    maxSize: 160,
    cell: TransactionAmount,
  },
  {
    id: "actions",
    minSize: 80,
    maxSize: 80,
    cell: TransactionActions,
  },
];

interface TransactionTableProps {
  data: TransactionData[];
  onCheck: (rowId: number, value: boolean) => void;
  onChange: (rowId: number, columnName: string, value: string | number) => void;
  onEdit: (rowId: number) => void;
  onCancel: (rowId: number) => void;
  onSave: (rowId: number) => Promise<void>;
}

export const TransactionTable: FC<TransactionTableProps> = ({ data, onCheck, onChange, onEdit, onCancel, onSave }) => {
  const table = useReactTable({
    columns,
    data,
    meta: {
      check: (rowId: number, value: boolean) => {
        onCheck(rowId, value);
      },
      changeInput: (rowId: number, columnName: string, value: string | number) => {
        onChange(rowId, columnName, value);
      },
      changeSelect: (rowId: number, columnName: string, value: string | number) => {
        onChange(rowId, columnName, value);
      },
      clickEdit: (rowId: number) => {
        onEdit(rowId);
      },
      clickCancel: (rowId: number) => {
        onCancel(rowId);
      },
      clickSave: (rowId: number) => {
        onSave(rowId);
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-full">
      <div className="overflow-hidden rounded-sm border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-bold px-3 h-10"
                      style={{
                        width: header.column.columnDef.size,
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-1"
                      style={{
                        width: cell.column.columnDef.size,
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  No Transaction Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
