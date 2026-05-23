<script>
  import Sidebar from '$lib/components/nav/sidebar/sidebar.svelte';

  let userPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://github.com/shadcn.png'
      });
    }, 1000);
  });
</script>

>

<h1>Welcome to your library project</h1>
<p>
  Create your package using @sveltejs/package and preview/showcase your work
  with SvelteKit
</p>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
<Sidebar
  version="0.1.0"
  app_name="Pleiades"
  items={[
    {
      label: 'Home',
      items: [
        {
          href: '/',
          label: 'Dashboard'
        },
        {
          href: '/settings',
          label: 'Settings'
        }
      ]
    }
  ]}
  avatar="http://localhost:5175/api/user/info/avatar"
  user={userPromise}
  logout={() => Promise.resolve({})}
>
  {#snippet children()}{/snippet}
</Sidebar>
