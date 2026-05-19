const emptyValidation = ({ field, errors, shake, className = "" }) => `
    border p-3 rounded-md w-full focus:outline-none transition duration-75
    ${errors[field] ? "border-red-500" : "focus:border-primary"}
    ${shake && errors[field] ? "rotate-1 -translate-x-1" : ""}
    ${className}
`;

export default emptyValidation;