/**
 * MSW Browser Worker Initialization for E2E Tests
 *
 * This module handles conditional initialization of MSW browser worker
 * when running E2E tests. It's completely isolated from production code
 * and only activated via REACT_APP_ENABLE_MSW environment variable.
 */

/**
 * Initialize MSW for E2E tests if enabled
 * @returns Promise that resolves when MSW is ready (or immediately if disabled)
 */
export async function initMSW(): Promise<void> {
  // Only enable MSW when explicitly requested (E2E tests)
  // Check if process is defined to avoid errors in production builds
  if (typeof process === 'undefined' || process.env.REACT_APP_ENABLE_MSW !== 'true') {
    return;
  }

  const { worker } = await import('./browser');

  // Start the worker and wait for it to be ready
  await worker.start({
    onUnhandledRequest: 'bypass',
  });

  // eslint-disable-next-line no-console
  console.log('[MSW] Browser worker started for E2E tests');
}
