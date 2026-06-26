/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional VPS contact-API endpoint (e.g. https://api.dominikkoenitzer.ch/contact).
   * When set, the contact form POSTs submissions here; when unset it falls back
   * to opening the visitor's mail client via a mailto: link. See server/contact-api.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
