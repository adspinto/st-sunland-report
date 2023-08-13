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

// activity: 1691890917788;
// ascendUpg: 465;
// bounty: 5123;
// collection: 4699;
// gld: 52092999223;
// help: 7308;
// invst: 67300216200;
// invst_monday: 67300216200;
// joined: 1615640193691;
// level: 69;
// lot: 8;
// master: 239;
// name: "LaisSouza#92353";
// percent_invested: null;
// prest: 72320;
// quEvComp: 1080904;
// quEvId: "39f78a8a-cef8-4486-bc97-4b438606d16f";
// rank: 2;
// score: 90928;
// _id: "60490ddb14b7281331a5b887";

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("level", {
    header: () => "level",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("joined", {
    header: () => <span>joined</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("activity", {
    header: () => <span>activity</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("gld", {
    header: () => <span>Net worth</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst", {
    header: "Invested",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst_monday", {
    header: "Invest Monday",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("percent_invested", {
    header: "percent_invested",
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
