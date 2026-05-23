<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Avatar from '$lib/components/ui/avatar';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import { goto } from '$app/navigation';
  import { disconnectWebsocket } from '$lib/backend/updater.svelte';
  import type { SidebarUserInfo } from './types';
  import { Skeleton } from '$lib/components/ui/skeleton';

  interface Props {
    user: SidebarUserInfo | Promise<SidebarUserInfo>;
    avatar?: string;
    logout: () => Promise<{ error?: any }>;
  }

  let { logout, user: userPromise, avatar }: Props = $props();

  const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            {...props}
          >
            <Avatar.Root class="size-8 rounded-lg">
              {#await userPromise then user}
                <Avatar.Image src={avatar} alt={user.name} />
              {/await}
              <Avatar.Fallback class="rounded-full">?</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-start text-sm leading-tight">
              {#await userPromise}
                <Skeleton class="mb-1 h-4" />
                <Skeleton class="h-3" />
              {:then user}
                <span class="truncate font-medium">{user.name}</span>
                <span class="truncate text-xs">{user.email}</span>
              {/await}
            </div>
            <ChevronsUpDownIcon class="ms-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            <Avatar.Root class="size-8 rounded-lg">
              {#await userPromise then user}
                <Avatar.Image src={avatar} alt={user.name} />
              {/await}
              <Avatar.Fallback class="rounded-full">?</Avatar.Fallback>
            </Avatar.Root>
            <div class="grid flex-1 text-start text-sm leading-tight">
              {#await userPromise}
                <Skeleton class="mb-1 h-4" />
                <Skeleton class="h-3" />
              {:then user}
                <span class="truncate font-medium">{user.name}</span>
                <span class="truncate text-xs">{user.email}</span>
              {/await}
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item class="cursor-pointer">
            {#snippet child({ props })}
              <a href="/account" {...props}>
                <SettingsIcon />
                Account
              </a>
            {/snippet}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          class="cursor-pointer"
          onclick={async () => {
            if (!(await logout()).error) {
              disconnectWebsocket();
              goto('/login?skip=true');
            }
          }}
        >
          <LogOutIcon />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
