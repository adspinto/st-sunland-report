import "../App.css";
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
    header: "Investimento total",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst_monday", {
    header: "Investimento salvo",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("invst_sofar", {
    header: "Investimento semanal",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("percent_invested", {
    header: "Percentual sobre meta",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("bounty_week", {
    header: "Renome",
    footer: (info) => info.column.id,
  }),
];

function Table({ data }) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
}

export default Table;
