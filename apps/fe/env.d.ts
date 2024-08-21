/// <reference types="vite/client" />
declare module 'vue3-smooth-dnd'
declare module 'vue-content-loader'
declare module 'toastify-js'
declare module 'autosize' {
  export default function autosize(element: HTMLElement): void
}

interface ImportMetaEnv {
  readonly VITE_BASE_BE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
