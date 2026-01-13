/**
 * Notification store for displaying success/error messages
 */

export const notification = $state({
	message: '',
	type: 'info' // 'success', 'error', 'info'
});

/**
 * Show a success notification
 * @param {string} message
 */
export function showSuccess(message) {
	notification.message = message;
	notification.type = 'success';
}

/**
 * Show an error notification
 * @param {string} message
 */
export function showError(message) {
	notification.message = message;
	notification.type = 'error';
}

/**
 * Clear the notification
 */
export function clearNotification() {
	notification.message = '';
	notification.type = 'info';
}
