/**
 * Generic API Client using native fetch.
 * Wraps requests with standard headers and error handling.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5216';

function buildUrl(endpoint) {
  const normalizedBaseUrl = BASE_URL.replace(/\/$/, '');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const apiEndpoint = normalizedEndpoint.startsWith('/api/') || normalizedEndpoint === '/api'
    ? normalizedEndpoint
    : `/api${normalizedEndpoint}`;

  if (normalizedBaseUrl.endsWith('/api')) {
    return apiEndpoint === '/api'
      ? normalizedBaseUrl
      : `${normalizedBaseUrl}${apiEndpoint.slice(4)}`;
  }

  return `${normalizedBaseUrl}${apiEndpoint}`;
}

async function fetchClient(endpoint, { body, ...customConfig } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    // Add Authorization headers here later if needed:
    // 'Authorization': `Bearer ${token}`
  };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(buildUrl(endpoint), config);
    
    // Parse JSON safely
    let data;
    try {
      data = await response.json();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      data = null; // No JSON body
    }

    if (!response.ok) {
      // Create standard error format
      const error = new Error(data?.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`[API Client Error] ${config.method} ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiClient = {
  get: (endpoint, config = {}) => fetchClient(endpoint, { method: 'GET', ...config }),
  post: (endpoint, body, config = {}) => fetchClient(endpoint, { body, method: 'POST', ...config }),
  put: (endpoint, body, config = {}) => fetchClient(endpoint, { body, method: 'PUT', ...config }),
  delete: (endpoint, config = {}) => fetchClient(endpoint, { method: 'DELETE', ...config }),
};
