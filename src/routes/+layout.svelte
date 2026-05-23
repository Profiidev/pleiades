<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner';
  let { children } = $props();
</script>

<ModeWatcher />
<Toaster position="top-right" closeButton={true} richColors={true} />

{@render children()}
