<script lang="ts">
  import { useImageCropperTrigger } from '#lib/components/ui-extra/image-cropper/image-cropper.svelte.js';
  import type { ImageCropperUploadTriggerProps } from '#lib/components/ui-extra/image-cropper/types.js';

  let {
    ref = $bindable(null),
    children,
    ...rest
  }: ImageCropperUploadTriggerProps = $props();

  const triggerState = useImageCropperTrigger();
</script>

<label
  {...rest}
  bind:this={ref}
  for={triggerState.rootState.id}
  class="hover:cursor-pointer"
>
  {@render children?.()}
</label>
