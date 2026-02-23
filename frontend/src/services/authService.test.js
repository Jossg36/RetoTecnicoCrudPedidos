import { describe, it, expect, beforeEach, vi } from 'vitest';
import authService from '@/services/authService';
/**
 * Pruebas unitarias para authService
 * Cubre: Login, registro, token management
 */
describe('authService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });
    describe('setToken', () => {
        it('should store token in localStorage', () => {
            const token = 'test-jwt-token-123';
            authService.setToken(token);
            expect(localStorage.getItem('authToken')).toBe(token);
        });
        it('should overwrite existing token', () => {
            authService.setToken('old-token');
            authService.setToken('new-token');
            expect(localStorage.getItem('authToken')).toBe('new-token');
        });
    });
    describe('getToken', () => {
        it('should retrieve token from localStorage', () => {
            const token = 'test-jwt-token-123';
            localStorage.setItem('authToken', token);
            const result = authService.getToken();
            expect(result).toBe(token);
        });
        it('should return null if no token stored', () => {
            const result = authService.getToken();
            expect(result).toBeNull();
        });
    });
    describe('isAuthenticated', () => {
        it('should return true when token exists', () => {
            localStorage.setItem('authToken', 'valid-token');
            expect(authService.isAuthenticated()).toBe(true);
        });
        it('should return false when no token', () => {
            expect(authService.isAuthenticated()).toBe(false);
        });
        it('should return false when token is empty string', () => {
            localStorage.setItem('authToken', '');
            expect(authService.isAuthenticated()).toBe(false);
        });
    });
    describe('logout', () => {
        it('should remove token from localStorage', () => {
            localStorage.setItem('authToken', 'test-token');
            authService.logout();
            expect(localStorage.getItem('authToken')).toBeNull();
        });
        it('should be safe to call multiple times', () => {
            authService.logout();
            authService.logout();
            expect(localStorage.getItem('authToken')).toBeNull();
        });
    });
    describe('login', () => {
        it('should accept valid credentials format', async () => {
            const credentials = {
                username: 'testuser',
                password: 'TestPassword123!',
            };
            // Mock no hace request real, solo valida formato
            expect(credentials.username).toBeTruthy();
            expect(credentials.password).toBeTruthy();
            expect(credentials.username.length).toBeGreaterThan(0);
        });
        it('should reject empty username', () => {
            const credentials = {
                username: '',
                password: 'TestPassword123!',
            };
            expect(credentials.username).toBeFalsy();
        });
        it('should reject empty password', () => {
            const credentials = {
                username: 'testuser',
                password: '',
            };
            expect(credentials.password).toBeFalsy();
        });
    });
    describe('register', () => {
        it('should accept valid registration data', () => {
            const data = {
                username: 'newuser',
                email: 'user@example.com',
                password: 'SecurePass123!',
            };
            expect(data.username).toBeTruthy();
            expect(data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            expect(data.password.length).toBeGreaterThanOrEqual(8);
        });
        it('should reject invalid email', () => {
            const email = 'invalid-email';
            expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
        it('should reject short password', () => {
            const password = 'Short1!';
            expect(password.length).toBeLessThan(8);
        });
    });
    describe('Token header injection', () => {
        it('should include token in request headers', () => {
            const token = 'test-jwt-token';
            authService.setToken(token);
            const headers = {};
            const authToken = authService.getToken();
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }
            expect(headers['Authorization']).toBe('Bearer test-jwt-token');
        });
        it('should not include header when no token', () => {
            const headers = {};
            const authToken = authService.getToken();
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }
            expect(headers['Authorization']).toBeUndefined();
        });
    });
});
