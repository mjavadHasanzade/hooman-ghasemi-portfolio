export type LoginPayload = {
  username: string;
  password: string;
};

export type SignUpPayload = {
  firstNumber: string;
  lastNumber: string;
  phoneNumber: string;
  email?: string;
  password: string;
};

