import { ChangeEvent, FC } from "react";
import { ColumnDef, flexRender, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Edit, Save } from "lucide-react";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    changeInput: (rowIndex: number, columnName: string, value: string | number) => void;
    changeSelect: (rowIndex: number, columnName: string, value: string | number) => void;
    clickEdit: (rowIndex: number) => void;
    clickSave: (rowIndex: number) => void;
  }
}

export const columns: ColumnDef<TransactionData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    size: 140,
    cell: ({ row, table }) => {
      const date = row.getValue<string>("date");
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          table.options.meta?.changeInput(row.index, "date", e.target.value);
        };

        return (
          <input
            className="w-full h-8 p-2 border border-muted-foreground rounded-sm outline-none"
            defaultValue={date}
            onChange={handleChange}
          />
        );
      }

      return <p className="p-2">{dayjs(date).format("YYYY-MM-DD HH:mm")}</p>;
    },
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    size: 160,
    cell: ({ row, table }) => {
      const transactionType = row.getValue<TransactionType>("transactionType");
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const transactionTypes = row.original.transactionTypes;

        const handleChange = (value: string) => {
          table.options.meta?.changeInput(row.index, "transactionType", value);
        };

        return (
          <Select defaultValue={`${transactionType?.id}`} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-full p-2 border-muted-foreground rounded-sm">
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

      return <p className="p-2">{transactionType?.name}</p>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 200,
    cell: ({ row, table }) => {
      const category = row.getValue<Category>("category");
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const categories = row.original.categories;

        const handleChange = (value: string) => {
          table.options.meta?.changeInput(row.index, "category", value);
        };

        return (
          <Select defaultValue={`${category?.id}`} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-full p-2 border-muted-foreground rounded-sm">
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

      return <p className="p-2">{category?.name}</p>;
    },
  },
  {
    accessorKey: "memo",
    header: "Memo",
    size: 200,
    cell: ({ row, table }) => {
      const memo = row.getValue<string | null>("memo");
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          table.options.meta?.changeInput(row.index, "memo", e.target.value);
        };

        return (
          <input
            className="w-full h-8 p-2 border border-muted-foreground rounded-sm outline-none"
            defaultValue={memo ?? ""}
            onChange={handleChange}
          />
        );
      }

      return <p className="p-2">{memo}</p>;
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    size: 120,
    cell: ({ row, table }) => {
      const currency = row.getValue<Currency>("currency");
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const currencies = row.original.currencies;

        const handleChange = (value: string) => {
          table.options.meta?.changeInput(row.index, "currency", value);
        };

        return (
          <Select defaultValue={`${currency?.id}`} onValueChange={handleChange}>
            <SelectTrigger size="sm" className="w-full p-2 border-muted-foreground rounded-sm">
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

      return <p className="p-2">{currency?.code}</p>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 160,
    cell: ({ row, table }) => {
      const amount = row.getValue<number>("amount");
      const currency = row.getValue<Currency>("currency");
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          table.options.meta?.changeInput(row.index, "amount", e.target.value);
        };

        return (
          <input
            type="number"
            className="w-full h-8 p-2 border border-muted-foreground rounded-sm outline-none"
            defaultValue={amount}
            onChange={handleChange}
          />
        );
      }

      if (!currency) return <p className="p-2">{amount}</p>;

      return <p className="p-2">{`${amount} ${currency?.symbol}`}</p>;
    },
  },
  {
    id: "actions",
    size: 60,
    cell: ({ row, table }) => {
      const status = row.original.status;

      if (status === "new" || status === "edit") {
        const handleClickSave = () => {
          table.options.meta?.clickSave(row.index);
        };

        return (
          <Button size="icon" onClick={handleClickSave}>
            <Save />
          </Button>
        );
      }

      const handleClickEdit = () => {
        table.options.meta?.clickEdit(row.index);
      };

      return (
        <Button size="icon" onClick={handleClickEdit}>
          <Edit />
        </Button>
      );
    },
  },
];

interface TransactionTableProps {
  data: TransactionData[];
  onChange: (rowIndex: number, columnName: string, value: string | number) => void;
  onEdit: (rowIndex: number) => void;
  onSave: (rowIndex: number) => Promise<void>;
}

export const TransactionTable: FC<TransactionTableProps> = ({ data, onChange, onEdit, onSave }) => {
  const table = useReactTable({
    columns,
    data,
    meta: {
      changeInput: (rowIndex: number, columnName: string, value: string | number) => {
        onChange(rowIndex, columnName, value);
      },
      changeSelect: (rowIndex: number, columnName: string, value: string | number) => {
        onChange(rowIndex, columnName, value);
      },
      clickEdit: (rowIndex: number) => {
        onEdit(rowIndex);
      },
      clickSave: (rowIndex: number) => {
        onSave(rowIndex);
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full h-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }} className="font-bold px-3 h-10">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
