import type { InjectionKey } from "vue";

export const FORM_ITEM_INJECTION_KEY = Symbol(
  "vue-shadcn-form"
) as InjectionKey<string>;
