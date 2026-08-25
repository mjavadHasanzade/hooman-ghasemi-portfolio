type MonthFormat = "long" | "short" | "numeric";

type NumberingSystem =
  | "latn" // 123456789
  | "arabext"; // ۱۲۳۴۵۶۷۸۹

type DateFormatOptions = {
  locale?: string;
  month?: MonthFormat;
  year?: "numeric" | "2-digit";
  day?: "numeric" | "2-digit";
  numberingSystem?: NumberingSystem;
};

export function formatDate(dateMs: number, options: DateFormatOptions = {}) {
  const {
    locale = "fa-IR",
    month = "long",
    year = "numeric",
    day = "2-digit",
    numberingSystem = "arabext",
  } = options;

  return new Intl.DateTimeFormat(locale, {
    year,
    month,
    day,
    numberingSystem,
  }).format(new Date(dateMs));
}
