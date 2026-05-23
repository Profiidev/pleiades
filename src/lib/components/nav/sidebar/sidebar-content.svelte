<script lang="ts">
  import { page } from '$app/state';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import type {
    NavGroup,
    SidebarUserInfo
  } from '$lib/components/nav/sidebar/types';

  interface Props {
    items: NavGroup[];
    user: SidebarUserInfo | Promise<SidebarUserInfo>;
  }

  const { items, user: userPromise }: Props = $props();

  const filteredItems = (items: NavGroup[], user: SidebarUserInfo) =>
    items
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.requiredPermission) {
            return user?.permissions.includes(item.requiredPermission);
          }
          return true;
        })
      }))
      .filter((item) => item.items.length > 0);

  const current = (filteredItems: NavGroup[]) =>
    filteredItems
      .flatMap((group) => group.items)
      .filter((item) => page.url.pathname.startsWith(item.href))
      .sort((a, b) => b.href.length - a.href.length)[0] ?? undefined;
</script>

{#await userPromise}
  <Sidebar.Group>
    <Sidebar.GroupLabel>Loading...</Sidebar.GroupLabel>
    <Sidebar.Menu>
      {#each Array.from({ length: 3 }) as _}
        <Sidebar.MenuItem>
          <Sidebar.MenuSkeleton />
        </Sidebar.MenuItem>
      {/each}
    </Sidebar.Menu>
  </Sidebar.Group>
{:then user}
  {@const filtered = filteredItems(items, user)}
  {#each filtered as group}
    <Sidebar.Group>
      <Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
      <Sidebar.Menu class="gap-1">
        {#each group.items as item}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              tooltipContent={item.label}
              class={item.href === current(filtered)?.href ? 'bg-muted' : ''}
            >
              {#snippet child({ props })}
                <a href={item.href} {...props}>
                  {#if item.icon}
                    <item.icon />
                  {/if}
                  <span>{item.label}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>
  {/each}
{/await}
