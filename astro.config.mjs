// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "NotDocs",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/NotMarra",
        },
      ],
      sidebar: [
        {
          label: "NotCredits",
          items: [
            "notcredits/getting-started",
            "notcredits/placeholders",
            "notcredits/permissions",
            "notcredits/commands",
            {
              label: "Have a problem?",
              link: "https://github.com/NotMarra/NotCredits/issues",
            },
            {
              label: "Download",
              link: "https://modrinth.com/plugin/notcredits",
            },
            {
              label: "Developer's API",
              link: "https://github.com/NotMarra/NotCredits/tree/main",
            },
          ],
        },
      ],
    }),
  ],
});
