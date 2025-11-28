export function getRoleFromToken(token) {
  if (!token) return 'customer'; 

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || 'customer'
  } catch (err) {
    console.error("Failed to parse JWT token:", err)
    return 'customer'
  }
}
const apiBookUrl = "https://localhost:7244/api/Sach";
const getBaseUrl = () => {
    const url = new URL(apiBookUrl);
    return `${url.protocol}//${url.host}`;
};

const fullServerUrl = getBaseUrl(); 

export const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl;
    }
    return `${fullServerUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl.trimStart('/')}`;
};