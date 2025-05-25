import type { Axios } from "axios";
import { API } from "./api/api";
import jQuery from "jquery";

declare global {
  interface Window {
    axios: Axios;
    $: jQuery;
    api: API;
  }
}

export {};
