# Security Token Implementation

## ⚠️ CRITICAL SECURITY UPDATE

This application has been updated to implement **secure token management** to prevent XSS-based token theft and account compromise.

## 🔒 Security Improvements

### Previous Implementation (INSECURE)
- ❌ Access tokens stored in `localStorage.authToken`
- ❌ Refresh tokens stored in `localStorage.refreshToken`
- ❌ **HIGH RISK**: Any XSS vulnerability could exfiltrate tokens
- ❌ **PERSISTENT COMPROMISE**: Stolen refresh tokens allow indefinite access

### New Implementation (SECURE)
- ✅ Access tokens stored **in memory only** (lost on page refresh)
- ✅ Refresh tokens stored in **HTTP-only, Secure, SameSite=Strict cookies**
- ✅ **XSS Protection**: JavaScript cannot access refresh tokens
- ✅ **Limited Exposure**: Short-lived access tokens (30 minutes)
- ✅ **Auto-refresh**: Transparent token renewal using HTTP-only cookies

## 🏗️ Implementation Details

### Frontend Changes

#### 1. Token Manager (`/src/utils/tokenManager.js`)
A singleton service that:
- Stores access tokens in memory (class property)
- Automatically refreshes expired tokens
- Prevents concurrent refresh requests
- Clears all tokens on logout
- **Never touches localStorage for tokens**

```javascript
import { tokenManager } from './utils/tokenManager';

// Set token (from login/refresh response)
tokenManager.setAccessToken(accessToken, expiresIn);

// Get valid token (auto-refreshes if needed)
const token = await tokenManager.getValidToken();

// Check authentication
const isAuth = await tokenManager.isAuthenticated();

// Clear on logout
tokenManager.clearTokens();
```

#### 2. Updated API Config (`/src/api/config.js`)
- `getAuthHeaders()` is now **async** and gets valid tokens automatically
- Handles 401 responses by attempting token refresh
- All API service functions updated to use `await getAuthHeaders()`

#### 3. Updated Redux Slices
- `logInSlice.js`: Removed token from state, uses tokenManager
- `signUpSlice.js`: Removed token from state, uses tokenManager
- User data (non-sensitive) still stored in localStorage for persistence

#### 4. Migration Function
- `migrateFromLocalStorage()` automatically moves old tokens to secure storage
- Called once on app mount in `App.jsx`
- Cleans up localStorage tokens permanently

### Backend Requirements

⚠️ **CRITICAL**: The backend MUST be updated to support this implementation:

#### 1. Login Endpoint (`/api/v1/auth/login/`)

**Current (Insecure)**:
```json
{
  "access": "eyJhbGci...",
  "refresh": "eyJhbGci..."
}
```

**Required (Secure)**:
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
Status: 200 OK
Set-Cookie: refreshToken=eyJhbGci...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh/; Max-Age=604800
Content-Type: application/json

{
  "access": "eyJhbGci...",
  "user": { ...user data... }
}
```

**Django Implementation Example**:
```python
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["POST"])
def login_view(request):
    # ... authentication logic ...
    
    response = JsonResponse({
        'access': str(access_token),
        'user': {
            'id': user.id,
            'email': user.email,
            # ... other user data ...
        }
    })
    
    # Set refresh token as HTTP-only cookie
    response.set_cookie(
        key='refreshToken',
        value=str(refresh_token),
        httponly=True,           # Cannot be accessed by JavaScript
        secure=True,             # Only sent over HTTPS
        samesite='Strict',       # CSRF protection
        path='/api/v1/auth/',    # Limited scope
        max_age=7*24*60*60,     # 7 days
    )
    
    return response
```

#### 2. Refresh Endpoint (`/api/v1/auth/refresh/`)

**Current (Insecure)**:
```json
POST /api/v1/auth/refresh/
{
  "refresh": "eyJhbGci..."
}
```

**Required (Secure)**:
```http
POST /api/v1/auth/refresh/
Cookie: refreshToken=eyJhbGci...

Response:
Status: 200 OK
Content-Type: application/json

{
  "access": "eyJhbGci..."
}
```

**Django Implementation Example**:
```python
@require_http_methods(["POST"])
def refresh_view(request):
    # Read refresh token from HTTP-only cookie
    refresh_token = request.COOKIES.get('refreshToken')
    
    if not refresh_token:
        return JsonResponse({'error': 'No refresh token'}, status=401)
    
    try:
        # Validate and decode refresh token
        token = RefreshToken(refresh_token)
        
        # Generate new access token
        access_token = str(token.access_token)
        
        return JsonResponse({
            'access': access_token
        })
    except Exception as e:
        return JsonResponse({'error': 'Invalid refresh token'}, status=401)
```

#### 3. Logout Endpoint (`/api/v1/auth/logout/`)

**Required**:
```http
POST /api/v1/auth/logout/
Cookie: refreshToken=eyJhbGci...

Response:
Status: 200 OK
Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/api/v1/auth/
```

**Django Implementation Example**:
```python
@require_http_methods(["POST"])
def logout_view(request):
    response = JsonResponse({'message': 'Logged out successfully'})
    
    # Clear the refresh token cookie
    response.delete_cookie(
        'refreshToken',
        path='/api/v1/auth/',
        samesite='Strict'
    )
    
    # Optional: Blacklist the refresh token
    refresh_token = request.COOKIES.get('refreshToken')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except:
            pass
    
    return response
```

#### 4. Signup Endpoint (`/api/v1/auth/register/`)

Should follow the same pattern as login - return access token in body, refresh token in HTTP-only cookie.

### CORS Configuration

Update backend CORS settings to allow credentials:

```python
# settings.py
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://your-production-domain.com",
]

# Cookie settings
SESSION_COOKIE_SECURE = True  # HTTPS only
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'Strict'
```

## 🔄 Migration Process

### For Developers

1. **Frontend** (✅ Already Updated):
   - Token manager implemented
   - All API calls updated to use async headers
   - Redux slices updated
   - localStorage tokens removed
   - Migration function runs on app load

2. **Backend** (⚠️ **REQUIRED**):
   - Update login endpoint to set HTTP-only cookie
   - Update refresh endpoint to read from cookie
   - Update logout endpoint to clear cookie
   - Configure CORS for credentials
   - Test cookie setting/reading

### For Users

No action required. On next login:
1. Old localStorage tokens are automatically cleared
2. New access token stored in memory
3. Refresh token set as HTTP-only cookie by backend
4. Seamless authentication experience

## 🧪 Testing

### Test Cookie Security

```javascript
// In browser console - should return undefined
console.log(document.cookie);  // refreshToken should NOT appear

// Access token should not be in localStorage
console.log(localStorage.getItem('authToken'));  // null

// But app should still be authenticated
// Check by making API calls - they should work
```

### Test Token Refresh

```javascript
// Wait 30+ minutes (or whatever access token expiry is)
// Make an API call - should automatically refresh and succeed
```

### Test Logout

```javascript
// After logout:
console.log(tokenManager.getAccessToken());  // null
// Cookies should be cleared
// Cannot make authenticated API calls
```

## 📊 Security Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Access Token Storage** | localStorage (JavaScript accessible) | Memory (lost on refresh) |
| **Refresh Token Storage** | localStorage (JavaScript accessible) | HTTP-only cookie (JavaScript cannot access) |
| **XSS Risk** | HIGH - tokens easily stolen | LOW - refresh token protected, access token short-lived |
| **Token Lifetime** | Long-lived (both tokens) | Access: 30min, Refresh: 7 days |
| **Persistent Compromise** | YES - stolen refresh token valid until expiry | NO - access tokens expire quickly, refresh token cannot be stolen |
| **CSRF Protection** | None | SameSite=Strict cookies |
| **Transport Security** | HTTP allowed | HTTPS required (Secure flag) |

## 🚨 Important Notes

1. **Backend Update is Mandatory**: This frontend change will NOT work until backend is updated
2. **HTTPS Required**: Secure cookies only work over HTTPS (or localhost)
3. **SameSite=Strict**: May need adjustment if using subdomains
4. **Cookie Path**: Set to `/api/v1/auth/` to limit scope
5. **Testing**: Use browser DevTools → Application → Cookies to verify

## 📝 Checklist for Backend Team

- [ ] Update login endpoint to set `refreshToken` HTTP-only cookie
- [ ] Update refresh endpoint to read from cookie (not request body)
- [ ] Update logout endpoint to clear cookie
- [ ] Configure CORS to allow credentials
- [ ] Set appropriate cookie flags (HttpOnly, Secure, SameSite)
- [ ] Test cookie setting in development
- [ ] Test cookie setting in production (HTTPS)
- [ ] Document cookie configuration
- [ ] Update API documentation

## 🔗 References

- [OWASP: Token Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

---

**Status**: ✅ Frontend Implementation Complete | ⚠️ Backend Implementation Required

**Last Updated**: December 4, 2025
