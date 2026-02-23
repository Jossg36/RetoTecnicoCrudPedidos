import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/validation.css';
export const ValidationError = ({ error, showIcon = true }) => {
    if (!error)
        return null;
    return (_jsxs("div", { className: "validation-error", children: [showIcon && _jsx("span", { className: "error-icon", children: "!" }), _jsx("span", { children: error })] }));
};
export const InputWithValidation = ({ label, error, helper, icon, ...props }) => {
    return (_jsxs("div", { className: "form-group-validation", children: [_jsx("label", { children: label }), _jsxs("div", { className: "input-wrapper", children: [icon && _jsx("span", { className: "input-icon", children: icon }), _jsx("input", { ...props, className: `input-field ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}` })] }), error && _jsx(ValidationError, { error: error }), helper && !error && _jsx("div", { className: "helper-text", children: helper })] }));
};
export const FormFieldStatus = ({ isValid, isDirty, isEmpty }) => {
    if (!isDirty && !isEmpty)
        return null;
    return (_jsx("span", { className: `field-status ${isValid ? 'valid' : 'invalid'}`, children: isValid ? '✓' : '✕' }));
};
