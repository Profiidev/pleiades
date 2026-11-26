import Root from '#lib/components/ui-extra/drawer/drawer.svelte';
import Content from '#lib/components/ui-extra/drawer/drawer-content.svelte';
import Description from '#lib/components/ui-extra/drawer/drawer-description.svelte';
import Overlay from '#lib/components/ui-extra/drawer/drawer-overlay.svelte';
import Footer from '#lib/components/ui-extra/drawer/drawer-footer.svelte';
import Header from '#lib/components/ui-extra/drawer/drawer-header.svelte';
import Title from '#lib/components/ui-extra/drawer/drawer-title.svelte';
import NestedRoot from '#lib/components/ui-extra/drawer/drawer-nested.svelte';
import Close from '#lib/components/ui-extra/drawer/drawer-close.svelte';
import Trigger from '#lib/components/ui-extra/drawer/drawer-trigger.svelte';
import Portal from '#lib/components/ui-extra/drawer/drawer-portal.svelte';

export {
  Root,
  NestedRoot,
  Content,
  Description,
  Overlay,
  Footer,
  Header,
  Title,
  Trigger,
  Portal,
  Close,

  //
  Root as Drawer,
  NestedRoot as DrawerNestedRoot,
  Content as DrawerContent,
  Description as DrawerDescription,
  Overlay as DrawerOverlay,
  Footer as DrawerFooter,
  Header as DrawerHeader,
  Title as DrawerTitle,
  Trigger as DrawerTrigger,
  Portal as DrawerPortal,
  Close as DrawerClose
};
