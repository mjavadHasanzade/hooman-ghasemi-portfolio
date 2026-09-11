import type { Locale } from "./api";

export type ContactCtaTranslation = {
  id: string;
  contactCtaId: string;
  locale: Locale;
  heading: string;
  description: string;
  connectLabel: string;
};

export type TypewriterPhraseTranslation = {
  id: string;
  typewriterPhraseId: string;
  locale: Locale;
  text: string;
};

export type TypewriterPhrase = {
  id: string;
  contactCtaId: string;
  order: number;
  createdAt: string;
  translations: TypewriterPhraseTranslation[];
  availableLocales: Locale[];
};

export type ContactCta = {
  id: "singleton";
  connectHref: string;
  translations: ContactCtaTranslation[];
  availableLocales: Locale[];
  phrases: TypewriterPhrase[];
  updatedAt: string;
};

export type ContactCtaTranslationInput = Pick<
  ContactCtaTranslation,
  "locale" | "heading" | "description" | "connectLabel"
>;

export type UpdateContactCtaInput = {
  connectHref?: string;
  translations?: ContactCtaTranslationInput[];
};

export type TypewriterPhraseTranslationInput = Pick<
  TypewriterPhraseTranslation,
  "locale" | "text"
>;

export type CreateTypewriterPhraseInput = {
  translations: TypewriterPhraseTranslationInput[];
};

export type UpdateTypewriterPhraseInput = Partial<CreateTypewriterPhraseInput>;
