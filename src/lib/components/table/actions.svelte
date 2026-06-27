<script lang="ts">
  import Trash from '@lucide/svelte/icons/trash';
  import Pencil from '@lucide/svelte/icons/pencil';
  import { Button } from '../ui/button/index.js';

  interface Props {
    edit_disabled: boolean;
    delete_disabled: boolean;
    edit?: (() => void) | string;
    remove: () => void;
  }

  let { edit_disabled, delete_disabled, edit, remove }: Props = $props();
</script>

<div class="mr-1 flex w-full space-x-4">
  <Button
    size="icon"
    variant="secondary"
    onclick={typeof edit === 'function' ? edit : undefined}
    href={typeof edit === 'string' ? edit : undefined}
    disabled={edit_disabled}
    class="ml-auto cursor-pointer"
  >
    <Pencil />
  </Button>
  <Button
    size="icon"
    variant="destructive"
    onclick={remove}
    disabled={delete_disabled}
    class="cursor-pointer"
  >
    <Trash />
  </Button>
</div>
