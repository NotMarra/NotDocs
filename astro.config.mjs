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
      customCss: [
        './src/styles/custom.css'
      ],
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
              attrs: {target: '_blank'}
            },
            {
              label: "Download",
              link: "https://modrinth.com/plugin/notcredits",
              attrs: {target: '_blank'}
            },
            {
              label: "Developer's API",
              link: "https://github.com/NotMarra/NotCredits/tree/main",
              attrs: {target: '_blank'},
              
            },
          ],
        },
      ],
    }),
  ],
  server: {
    allowedHosts: true
  }
});
