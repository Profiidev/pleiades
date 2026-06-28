const URL_SAFE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

export const generateCodeVerifier = (length = 64) => {
  const randomValues = new Uint32Array(length);
  // Crypto.getRandomValues() gives us cryptographically secure random numbers
  crypto.getRandomValues(randomValues);

  let result = '';
  for (let i = 0; i < length; i += 1) {
    // Map the random number to an index in our character string
    const randomIndex = randomValues[i] % URL_SAFE_CHARS.length;
    result += URL_SAFE_CHARS[randomIndex];
  }

  return result;
};

export const generateCodeChallenge = async (codeVerifier: string) => {
  // 1. Convert the string to ASCII bytes (TextEncoder handles this)
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  // 2. Hash the bytes using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 3. Convert the ArrayBuffer to a Base64URL string (No Padding)
  const hashArray = new Uint8Array(hashBuffer);
  const base64 = btoa(String.fromCharCode(...hashArray));

  // Make the base64 string URL-safe and remove padding (`=`)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/, '');
};
