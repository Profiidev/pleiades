<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';
  import { Toaster } from '$lib/components/ui/sonner';
  import Sidebar from '$lib/components/nav/sidebar/sidebar.svelte';
  let { children } = $props();
</script>

<ModeWatcher />
<Toaster position="top-right" closeButton={true} richColors={true} />

<Sidebar
  user={{
    email: 'unknown@example.com',
    name: 'Unknown User',
    permissions: []
  }}
  app_name="my-app"
  version="0.1.0"
  items={[]}
  logout={async () => ({})}
>
  {@render children()}
</Sidebar>
