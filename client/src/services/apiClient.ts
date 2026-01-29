const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = "GET", body, headers = {} } = options;

  // Get token from localStorage if available
  const token = localStorage.getItem("token") ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5MGZlYTg5NzRmZDZiMzYxNDcwODQiLCJyYW5kb20iOiIwLjk5MDExOTE2OTczMTM4NzYiLCJpYXQiOjE3Njk3MTkzNTQsImV4cCI6MTc2OTcyMjk1NH0.yHG7VLbdxALDCmQX-b4WXBYmnvvDhpHYc8BxrnvJKCk";

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export default apiClient;
