export interface UsernameCheckResponse {
    data: boolean | null;
    error: boolean;
    errors?: Array<{ message: string }>;
  }
  

  