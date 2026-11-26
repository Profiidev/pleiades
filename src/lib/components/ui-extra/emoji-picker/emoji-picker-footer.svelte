<script lang="ts">
  import type { EmojiPickerFooterProps } from '#lib/components/ui-extra/emoji-picker/types.js';
  import { useEmojiPickerFooter } from '#lib/components/ui-extra/emoji-picker/emoji-picker.svelte.js';
  import { cn } from '../../../blocks/utils.js';

  let {
    class: className,
    children,
    ...rest
  }: EmojiPickerFooterProps = $props();

  const footerState = useEmojiPickerFooter();
</script>

<div
  {...rest}
  class={cn('border-border relative max-w-full border-t p-2', className)}
>
  {@render children?.({ active: footerState.root.emojiPickerState.active })}
</div>
