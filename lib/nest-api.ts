/**
 * Central functions for interacting with the Nest API.
 * This file handles authentication and automatically attaches the access token to requests.
 */

/**
 * Authenticates with the NestJS backend and retrieves a JWT bearer token.
 * The token is required to access protected API endpoints.
 * @returns A promise that resolves to the JWT access token as a string.
 * @throws An error if authentication fails.
 */

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

export async function GetNestToken(): Promise<string> {
  // Check if we have a cached token that is still valid (with a 1-minute buffer)
  if (
    cachedToken &&
    tokenExpiration &&
    Date.now() < tokenExpiration - 60 * 1000
  ) {
    return cachedToken;
  }

  try {
    const response = await fetch(`${process.env.NEST_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Login credentials are read from environment variables for security reasons
      body: JSON.stringify({
        username: process.env.NEST_USERNAME,
        password: process.env.NEST_PASSWORD,
      }),
    });

    // Throw an error if authentication fails
    if (!response.ok) {
      throw new Error("Error authenticating with the Nest API");
    }

    // Backend response contains the JWT access token
    const data = await response.json();
    cachedToken = data.accessToken as string;

    const payload = JSON.parse(
      Buffer.from(cachedToken.split(".")[1], "base64").toString()
    );
    tokenExpiration = payload.exp * 1000;

    // Return the access token so it can be used for API requests
    return cachedToken;
  } catch (error) {
    console.error("Error authenticating with the Nest API:", error);
    throw error;
  }
}

/**
 * Sends a request to the NestJS backend API.
 * Before making the request, it retrieves a valid JWT token using GetNestToken and includes it in the Authorization header.
 * This allows you to call any protected API endpoint without worrying about authentication details in your components.
 * @param endpoint The specific API endpoint to call (e.g., "api/squad").
 * @param init Optional RequestInit object to customize the fetch request (e.g., method, body).
 * @returns A promise that resolves to the response data from the API, typed as T.
 * @throws An error if the request fails or if authentication fails.
 */
export async function NestFetch<T>(
  endpoint: string,
  init: RequestInit = {}
): Promise<T> {
  try {
    // Get a valid bearer token for authentication
    const token = await GetNestToken();

    const response = await fetch(`${process.env.NEST_API_URL}${endpoint}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        // Attach the bearer token to authorize the request
        Authorization: `Bearer ${token}`,
        ...(init.headers ?? {}),
      },
    });

    // Throw an error if the request fails
    if (!response.ok) {
      throw new Error(`Response error: ${response.statusText}`);
    }

    const text = await response.text();

    // If the response is empty, return undefined (e.g., for DELETE requests)
    if (!text) {
      return undefined as T;
    }

    // Return the JSON response from the API
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(
      `Response error: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
