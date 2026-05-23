<script lang="ts">
  import KeyRound from '@lucide/svelte/icons/key-round';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import { Button } from '../ui/button/index.js';
  import { FieldSeparator } from '../ui/field/index.js';

  interface Props {
    isLoading: boolean;
    passkeyClick: () => void;
    passkeyError: string;
  }

  let { isLoading, passkeyClick, passkeyError }: Props = $props();
</script>

<FieldSeparator class="*:data-[slot=field-separator-content]:bg-card my-4"
  >Or continue with</FieldSeparator
>
{#if passkeyError !== ''}
  <span class="text-destructive truncate text-sm">{passkeyError}</span>
{/if}
<Button
  variant="outline"
  type="button"
  disabled={isLoading}
  onclick={passkeyClick}
  class="cursor-pointer"
>
  {#if isLoading}
    <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
  {:else}
    <KeyRound class="mr-2 h-4 w-4" />
  {/if}
  Passkey
</Button>
