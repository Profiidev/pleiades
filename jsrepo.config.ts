import { defineConfig } from 'jsrepo';
import oxfmt from '@jsrepo/transform-oxfmt';

export default defineConfig({
  paths: {
    '*': 'src/lib/blocks',
    action: 'src/lib/blocks',
    actions: 'src/lib/actions',
    component: 'src/lib/blocks',
    hook: 'src/lib/blocks',
    hooks: 'src/lib/hooks',
    lib: 'src/lib/blocks',
    ui: 'src/lib/components/ui-extra',
    util: 'src/lib/blocks',
    utils: 'src/lib/util'
  },
  registries: ['@ieedan/shadcn-svelte-extras'],
  transforms: [oxfmt()]
});
