import { formatSemester } from "../formats/semester.jsx";
import { formatYearLevel } from "../formats/yearLevel.jsx";

const Table = ({
        title,
        data = [],
        columns = [],
        getRowKey,
        onRowClick = () => {},
    }) => {

    const formatValue = (field, value) => {
        if (!value) return "-";

        if (field === "semester")  return formatSemester(value);

        if (field === "year_level") return formatYearLevel(value);

        return value;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-tertiary text-white text-center">
                            {columns.map((col, i) => (
                                <th key={i} className="p-3 border">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={getRowKey(item)}
                                    className="hover:bg-slate-50 cursor-pointer"
                                    onClick={() => onRowClick(item)}
                                >
                                    {columns.map((col, j) => (
                                        <td key={j} className="p-3 border text-center">
                                            {formatValue(col.field, item[col.field])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) 
                        : 
                        (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4 text-slate-500">
                                    No data found
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;