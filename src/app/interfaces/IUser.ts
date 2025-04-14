

export interface Address {
  formatted: string;
}

export interface UserProfile {
  address: Address;
  aud: string;
  auth_time: number;
  birthdate: string;
  'cognito:groups': string[];
  'cognito:username': string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  gender: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  origin_jti: string;
  phone_number: string;
  phone_number_verified: boolean;
  picture: string;
  sub: string;
  token_use: string;
}
