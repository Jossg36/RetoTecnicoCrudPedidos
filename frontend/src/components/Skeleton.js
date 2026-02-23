import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/skeleton.css';
const Skeleton = ({ count = 1, circle = false, height = '20px', width = '100%' }) => {
    return (_jsx(_Fragment, { children: Array.from({ length: count }).map((_, i) => (_jsx("div", { className: `skeleton ${circle ? 'skeleton-circle' : ''}`, style: { height, width } }, i))) }));
};
const SkeletonCard = () => (_jsxs("div", { className: "skeleton-card", children: [_jsxs("div", { className: "skeleton-card-header", children: [_jsx(Skeleton, { width: "60%", height: "24px" }), _jsx(Skeleton, { width: "100px", height: "20px", circle: true })] }), _jsxs("div", { className: "skeleton-card-body", children: [_jsx(Skeleton, { height: "16px" }), _jsx(Skeleton, { height: "16px", width: "80%" }), _jsx(Skeleton, { height: "16px", width: "70%" })] }), _jsxs("div", { className: "skeleton-card-items", children: [_jsx(Skeleton, { height: "14px", width: "90%" }), _jsx(Skeleton, { height: "14px", width: "85%" })] }), _jsxs("div", { className: "skeleton-card-actions", children: [_jsx(Skeleton, { width: "60px", height: "32px" }), _jsx(Skeleton, { width: "60px", height: "32px" })] })] }));
export { Skeleton, SkeletonCard };
