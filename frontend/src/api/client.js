const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:5001";

const buildUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : null;
};

export const apiRequest = async (path, options = {}) => {
  const { method = "GET", token, body, headers } = options;
  const requestHeaders = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(headers || {}),
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await parseResponseBody(response);
  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
};

export const apiUpload = async (path, options = {}) => {
  const { token, formData, headers } = options;
  const requestHeaders = {
    ...(headers || {}),
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: requestHeaders,
    body: formData,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await parseResponseBody(response);
  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
};
