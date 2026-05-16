import { defineConfig } from 'jsrepo';
import oxfmt from '@jsrepo/transform-oxfmt';

export default defineConfig({
  paths: {
    '*': '$lib/blocks',
    action: 'src/lib/blocks',
    actions: '$lib/actions',
    component: 'src/lib/blocks',
    hook: 'src/lib/blocks',
    hooks: '$lib/hooks',
    lib: 'src/lib/blocks',
    ui: '$lib/components/ui-extra',
    util: 'src/lib/blocks',
    utils: '$lib/util'
  },
  registries: ['@ieedan/shadcn-svelte-extras'],
  transforms: [oxfmt()]
});
