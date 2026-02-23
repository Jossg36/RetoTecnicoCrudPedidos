import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/empty-state.css';
const EmptyState = ({ icon = '📋', title, description, action, }) => {
    return (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state-icon", children: icon }), _jsx("h3", { className: "empty-state-title", children: title }), description && _jsx("p", { className: "empty-state-description", children: description }), action && (_jsx("button", { onClick: action.onClick, className: "btn-primary empty-state-button", children: action.label }))] }));
};
export default EmptyState;
