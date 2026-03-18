// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://wiki.notmarra.com",
  integrations: [
    starlight({
      title: "NotWiki",
      favicon: "./logo_bg.png",
      customCss: ["./src/styles/custom.css"],
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
              attrs: { target: "_blank" },
            },
            {
              label: "Download",
              link: "https://modrinth.com/plugin/notcredits",
              attrs: { target: "_blank" },
            },
            {
              label: "Developer's API",
              link: "https://github.com/NotMarra/NotCredits/tree/main",
              attrs: { target: "_blank" },
            },
          ],
        },
        {
          label: "NotLib",
          items: [
            {
              label: "Getting started",
              items: [
                "notlib/getting-started/installation",
                "notlib/getting-started/notplugin",
              ],
            },
            {
              label: "Database",
              items: [
                "notlib/database/getting-started",
                "notlib/database/entity-repository",
                "notlib/database/query-builder",
              ],
            },
            {
              label: "Cache",
              items: ["notlib/cache/overview", "notlib/cache/not-cache"],
            },
            {
              label: "Other",
              items: [
                "notlib/gui/overview",
                "notlib/commands/overview",
                "notlib/config/overview",
                "notlib/scheduler/overview",
                "notlib/chat/overview",
                "notlib/language/overview",
              ],
            },
          ],
        },
      ],
    }),
  ],
  server: {
    allowedHosts: true,
  },
});
