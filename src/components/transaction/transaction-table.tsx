import { ChangeEvent, FC } from "react";
import { ColumnDef, flexRender, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import { Edit, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    check: (rowId: number, value: boolean) => void;
    changeInput: (rowId: number, columnName: string, value: string | number) => void;
    changeSelect: (rowId: number, columnName: string, value: string | number) => void;
    clickEdit: (rowId: number) => void;
    clickCancel: (rowId: number) => void;
    clickSave: (rowId: number) => void;
  }
}

export const columns: ColumnDef<TransactionData>[] = [
  {
    id: "check",
    minSize: 40,
    maxSize: 40,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const checked = row.original.checked ?? false;

      const handleCheck = (checked: boolean) => {
        table.options.meta?.check(id, checked);
      };

      return (
        <div className="flex items-center justify-center">
          <Checkbox checked={checked} onCheckedChange={handleCheck} />
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    minSize: 160,
    maxSize: 160,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const date = row.original.date ?? "";
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          table.options.meta?.changeInput(id, "date", e.target.value);
        };

        return (
          <input
            className="w-full h-8 p-2 leading-4 border border-input-foreground rounded-sm outline-none"
            defaultValue={date}
            onChange={handleChange}
          />
        );
      }

      return <p className="h-8 p-2 leading-4">{date}</p>;
    },
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    minSize: 140,
    maxSize: 140,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const transactionTypes = row.original.transactionTypes;
      const transactionType = row.original.transactionType;
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (value: string) => {
          table.options.meta?.changeInput(id, "transactionType", value);
        };

        return (
          <Select defaultValue={`${transactionType?.id}`} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>

            <SelectContent>
              {transactionTypes?.map((transactionType) => (
                <SelectItem key={transactionType.id} value={`${transactionType.id}`}>
                  {transactionType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return <p className="h-8 p-2 leading-4">{transactionType?.name}</p>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    minSize: 160,
    maxSize: 160,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const categories = row.original.categories;
      const category = row.original.category;
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (value: string) => {
          table.options.meta?.changeInput(id, "category", value);
        };

        return (
          <Select defaultValue={`${category?.id}`} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={`${category.id}`}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return <p className="h-8 p-2 leading-4">{category?.name}</p>;
    },
  },
  {
    accessorKey: "memo",
    header: "Memo",
    cell: ({ row, table }) => {
      const id = row.original.id;
      const memo = row.original.memo;
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          table.options.meta?.changeInput(id, "memo", e.target.value);
        };

        return (
          <input
            className="w-full h-8 p-2 leading-4 border border-input-foreground rounded-sm outline-none"
            defaultValue={memo ?? ""}
            onChange={handleChange}
          />
        );
      }

      return <p className="h-8 p-2 leading-4">{memo}</p>;
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    minSize: 120,
    maxSize: 120,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const currencies = row.original.currencies;
      const currency = row.original.currency;
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (value: string) => {
          table.options.meta?.changeInput(id, "currency", value);
        };

        return (
          <Select defaultValue={`${currency?.id}`} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-full p-2 border-input-foreground rounded-sm">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>

            <SelectContent>
              {currencies?.map((currency) => (
                <SelectItem key={currency.id} value={`${currency.id}`}>
                  {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return <p className="h-8 p-2 leading-4">{currency?.code}</p>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    minSize: 160,
    maxSize: 160,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const amount = row.original.amount;
      const currency = row.original.currency;
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          table.options.meta?.changeInput(id, "amount", e.target.value);
        };

        return (
          <input
            type="number"
            className="w-full h-8 p-2 leading-4 border border-input-foreground rounded-sm outline-none"
            defaultValue={amount}
            onChange={handleChange}
          />
        );
      }

      if (!currency) return <p className="h-8 p-2 leading-4">{amount}</p>;

      return <p className="h-8 p-2 leading-4">{`${amount} ${currency?.symbol}`}</p>;
    },
  },
  {
    id: "actions",
    minSize: 80,
    maxSize: 80,
    cell: ({ row, table }) => {
      const id = row.original.id;
      const status = row.original.status;

      const handleClickEdit = () => {
        table.options.meta?.clickEdit(id);
      };

      const handleClickCancel = () => {
        table.options.meta?.clickCancel(id);
      };

      const handleClickSave = () => {
        table.options.meta?.clickSave(id);
      };

      if (status === "new" || status === "edit") {
        return (
          <div className="flex justify-end gap-1">
            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleClickSave}>
              <Save />
            </Button>

            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleClickCancel}>
              <X />
            </Button>
          </div>
        );
      }

      return (
        <div className="flex justify-end">
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleClickEdit}>
            <Edit />
          </Button>
        </div>
      );
    },
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
      <div className="overflow-hidden rounded-md border">
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
                    <TableCell key={cell.id} className="p-1">
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
