export function getPasswordStrength(password: string) {
  if (!password || password.length === 0) {
    return {
      label: "" as const,
      value: 0,
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "weak" as const, value: 33 };
  if (score <= 4) return { label: "medium" as const, value: 66 };
  return { label: "strong" as const, value: 100 };
}

export function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

export type PasswordStrength = ReturnType<typeof getPasswordStrength>;
