/**
 * Secure Token Manager
 * 
 * This module manages JWT access tokens securely by:
 * 1. Storing access tokens ONLY in memory (never localStorage)
 * 2. Relying on HTTP-only cookies for refresh tokens (backend must set these)
 * 3. Automatically refreshing expired access tokens
 * 4. Preventing XSS token exfiltration
 * 
 * Security Benefits:
 * - Access tokens stored in memory are lost on page refresh (short-lived by design)
 * - Refresh tokens in HTTP-only cookies cannot be accessed by JavaScript
 * - Even if XSS occurs, attacker cannot steal refresh token
 * - Access tokens are short-lived, limiting exposure window
 */

class TokenManager {
  constructor() {
    // Store access token in memory only
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshPromise = null; // Prevent concurrent refresh requests
  }

  /**
   * Set the access token (received from login/refresh)
   * @param {string} token - JWT access token
   * @param {number} expiresIn - Token expiry in seconds (optional)
   */
  setAccessToken(token, expiresIn = 1800) {
    this.accessToken = token;
    // Set expiry time (default 30 minutes)
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
  }

  /**
   * Get the current access token
   * @returns {string|null} Access token or null if not set
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Check if access token is expired or about to expire
   * @param {number} bufferSeconds - Refresh if expiring within this many seconds
   * @returns {boolean}
   */
  isTokenExpired(bufferSeconds = 60) {
    if (!this.accessToken || !this.tokenExpiry) {
      return true;
    }
    return Date.now() >= (this.tokenExpiry - (bufferSeconds * 1000));
  }

  /**
   * Refresh the access token using the HTTP-only refresh token cookie
   * The backend must handle this by reading the cookie and returning a new access token
   * @returns {Promise<string>} New access token
   */
  async refreshAccessToken() {
    // Prevent concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
        
        // Call refresh endpoint - backend will read refresh token from HTTP-only cookie
        const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in request
        });

        if (!response.ok) {
          // Refresh token is invalid or expired
          this.clearTokens();
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        
        // Set new access token
        if (data.access) {
          this.setAccessToken(data.access);
          return data.access;
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (error) {
        this.clearTokens();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Get a valid access token, refreshing if necessary
   * @returns {Promise<string|null>} Valid access token or null
   */
  async getValidToken() {
    if (!this.accessToken) {
      // No token, try to refresh (will read from HTTP-only cookie)
      try {
        return await this.refreshAccessToken();
      } catch {
        return null;
      }
    }

    if (this.isTokenExpired()) {
      // Token expired, refresh it
      try {
        return await this.refreshAccessToken();
      } catch {
        return null;
      }
    }

    return this.accessToken;
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshPromise = null;
  }

  /**
   * Check if user is authenticated (has valid token or can refresh)
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const token = await this.getValidToken();
    return !!token;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

// Clean up old localStorage tokens on load (migration)
export const migrateFromLocalStorage = () => {
  const oldAccessToken = localStorage.getItem('authToken');
  const oldRefreshToken = localStorage.getItem('refreshToken');
  
  if (oldAccessToken || oldRefreshToken) {
    console.warn('⚠️ SECURITY: Found tokens in localStorage. Migrating to secure storage...');
    
    // Move access token to memory if it exists
    if (oldAccessToken) {
      tokenManager.setAccessToken(oldAccessToken);
    }
    
    // Clear ALL tokens from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    console.log('✅ Tokens removed from localStorage. Access token now in memory only.');
    console.log('⚠️ IMPORTANT: Backend must set refresh token as HTTP-only cookie.');
  }
};
