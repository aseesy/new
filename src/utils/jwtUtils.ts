export interface JwtPayload {
    unique_name: string,
    role: string,
    certserialnumber: number,
    given_name: string,
    family_name: string,
    nbf: number,
    exp: number,
    iat: number
}


export const decodeJWT = (token: string): JwtPayload|null => {
    try {
      // Split the token into header, payload, and signature
      const base64Url = token.split('.')[1]; // Get the payload (second part of the token)

      // Replace any characters that are URL-safe, decode the Base64 string
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Decode the Base64 string to a JSON object
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => {
            return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid JWT token', error);
      return null; // Return null if decoding fails
    }
  };