/**
 * Authentication store for managing user session
 */

import { browser } from '$app/environment';

const TOKEN_KEY = 'feinar_auth_token';

export const auth = $state({
	token: browser ? localStorage.getItem(TOKEN_KEY) : null,
	isAuthenticated: browser ? !!localStorage.getItem(TOKEN_KEY) : false
});

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export function setToken(token) {
	auth.token = token;
	auth.isAuthenticated = true;
	if (browser) {
		localStorage.setItem(TOKEN_KEY, token);
	}
}

/**
 * Clear authentication token (logout)
 */
export function clearToken() {
	auth.token = null;
	auth.isAuthenticated = false;
	if (browser) {
		localStorage.removeItem(TOKEN_KEY);
	}
}

/**
 * Get current token
 * @returns {string|null}
 */
export function getToken() {
	return auth.token;
}
