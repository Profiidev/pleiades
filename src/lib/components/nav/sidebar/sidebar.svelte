<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar';
  import SidebarHeader from './sidebar-header.svelte';
  import SidebarContent from './sidebar-content.svelte';
  import SidebarUser from './sidebar-user.svelte';
  import type { Component, Snippet } from 'svelte';
  import type { NavGroup, SidebarUserInfo } from './types';

  interface Props {
    user?: SidebarUserInfo;
    avatar?: string;
    children: Snippet;
    version: string;
    app_name: string;
    app_icon?: Component;
    iconClass?: string;
    items: NavGroup[];
    logout: () => Promise<{ error?: any }>;
  }

  const {
    children,
    user,
    avatar,
    version,
    app_name,
    app_icon,
    items,
    logout,
    iconClass
  }: Props = $props();
</script>

<Sidebar.Provider class="h-svh">
  {@const sidebar = Sidebar.useSidebar()}
  <Sidebar.Root
    collapsible="icon"
    variant="floating"
    class={(sidebar?.isMobile && 'w-(--sidebar-width)!') || ''}
  >
    <Sidebar.Header>
      <SidebarHeader {app_name} {app_icon} {version} {iconClass} />
    </Sidebar.Header>
    <Sidebar.Content>
      <SidebarContent {items} {user} />
    </Sidebar.Content>
    <Sidebar.Footer>
      <SidebarUser {avatar} {user} {logout} />
    </Sidebar.Footer>
  </Sidebar.Root>
  <Sidebar.Inset class="min-h-0 min-w-0 grow">
    <Sidebar.Trigger
      class="absolute top-5 left-3 flex cursor-pointer md:hidden"
    />
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
