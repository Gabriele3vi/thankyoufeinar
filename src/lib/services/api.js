/**
 * API service for Feinar authentication and time tracking
 */

const API_BASE_URL = 'https://portale-dipendenti-api.feinar.it/api/v1';
const ORIGIN = 'https://hr.feinar.it';

const DEFAULT_HEADERS = {
	'Host': 'portale-dipendenti-api.feinar.it',
	'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0',
	'Accept': 'application/json, text/plain, */*',
	'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3',
	'Content-Type': 'application/json',
	'Origin': ORIGIN,
	'Referer': `${ORIGIN}/`
};

/**
 * Login to Feinar API
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<string>} JWT token
 * @throws {Error} If login fails
 */
export async function login(username, password) {
	const url = `${API_BASE_URL}/Auth/web/login`;

	const response = await fetch(url, {
		method: 'POST',
		headers: DEFAULT_HEADERS,
		body: JSON.stringify({
			nomeUtente: username,
			password: password
		})
	});

	if (!response.ok) {
		throw new Error(`Login failed with status ${response.status}`);
	}

	const data = await response.json();

	if (!data.jwtToken) {
		throw new Error('No JWT token received from server');
	}

	return data.jwtToken;
}

/**
 * Fetch time tracking data (timbrature) for a date range
 * @param {string} token - JWT authentication token
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Time tracking data
 * @throws {Error} If the request fails
 */
export async function fetchTimbrature(token, startDate, endDate) {
	const url = `${API_BASE_URL}/Presenze?da=${startDate}&a=${endDate}`;

	const headers = {
		...DEFAULT_HEADERS,
		'Authorization': `Bearer ${token}`
	};

	const response = await fetch(url, {
		method: 'GET',
		headers
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch timbrature with status ${response.status}`);
	}

	return await response.json();
}

/**
 * Clock in/out (timbra)
 * @param {string} direction - 'E' for entry (entra), 'U' for exit (esci)
 * @param {string} token - JWT authentication token
 * @param {string} timestamp - ISO datetime string
 * @returns {Promise<Object>} Response data
 * @throws {Error} If the request fails
 */
export async function clockInOut(direction, token, timestamp) {
	const url = `${API_BASE_URL}/Presenze/web/timbra`;

	const headers = {
		...DEFAULT_HEADERS,
		'Authorization': `Bearer ${token}`
	};

	const payload = {
		colore: '#B03A2E',
		dataOra: timestamp,
		suffisso: '',
		tipo: 'T',
		verso: direction
	};

	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `Request failed with status ${response.status}`);
	}

	try {
		return await response.json();
	} catch {
		return await response.text();
	}
}

