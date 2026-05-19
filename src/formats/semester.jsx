export const formatSemester = (value) => {
    if (value === 1 || value === "1") return "1st Semester";
    if (value === 2 || value === "2") return "2nd Semester";
    return value;
};