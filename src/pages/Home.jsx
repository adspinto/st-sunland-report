import { useState } from "react";
import "../App.css";
import useGuild from "../hooks/useGuild";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    header: () => "Nome",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("level", {
    header: () => "Nivel",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("joined", {
    header: () => "Na guild desde",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("activity", {
    header: () => "Ultima atividade",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("gld", {
    header: () => "Patrimônio",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst", {
    header: "Investimentos atuais",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst_monday", {
    header: "Investimentos Segunda",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst_sofar", {
    header: "Soma Investimentos",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("percent_invested", {
    header: "Percentual",
    footer: (info) => info.column.id,
  }),
];

function App() {
  const query = useGuild();

  const table = useReactTable({
    data: query.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </>
  );
}

export default App;
