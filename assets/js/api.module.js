import { config } from "./config.module.js";

async function getToken() {
  const response = await fetch(`${config.base_url}/token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw response;
  }

  document.head.querySelector("meta[name=csrf-token]").content =
    await response.json();
}

export { getToken };
