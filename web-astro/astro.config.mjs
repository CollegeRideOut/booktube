import { defineConfig } from 'astro/config';
import aws from 'astro-sst';
import tailwind from "@astrojs/tailwind";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: aws(),
  integrations: [tailwind(), preact()]
});
