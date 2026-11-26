<script lang="ts">
  import { cn } from '../../../blocks/utils.js';
  import type { TreeViewRootProps } from '#lib/components/ui-extra/tree-view/types.js';

  let { children, class: className }: TreeViewRootProps = $props();
</script>

<div role="tree" class={cn('flex flex-col', className)}>
  {@render children?.()}
</div>
