import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
// Cleanup después de cada test
afterEach(() => {
    cleanup();
});
// Mock de localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});
// Mock de window.confirm
window.confirm = vi.fn(() => true);
// Mock de console methods
global.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
};
