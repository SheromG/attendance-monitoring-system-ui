export const formatYearLevel = (value) => {
    if (value === 1 || value === "1") return "1st Year";
    if (value === 2 || value === "2") return "2nd Year";
    if (value === 3 || value === "3") return "3rd Year";
    if (value === 4 || value === "4") return "4th Year";
    return value;
}