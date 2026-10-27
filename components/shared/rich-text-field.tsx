"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { RichTextEditor } from "./rich-text-editor";
import { richTextPlainText } from "@/lib/rich-text";

export function RichTextField<T extends FieldValues>({ control, name, id, locale, required }: {
  control: Control<T>;
  name: FieldPath<T>;
  id: string;
  locale: "fa" | "en";
  required?: boolean;
}) {
  return <Controller control={control} name={name}
    rules={required ? { validate: (value) => Boolean(richTextPlainText(String(value ?? "")).trim()) || "متن الزامی است." } : undefined}
    render={({ field, fieldState }) => <>
      <RichTextEditor key={`${name}-${locale}`} id={id} value={String(field.value ?? "")}
        onChange={field.onChange} onBlur={field.onBlur} dir={locale === "fa" ? "rtl" : "ltr"} />
      {fieldState.error && <p role="alert" className="text-xs text-destructive">{fieldState.error.message}</p>}
    </>} />;
}
