import Root from '#lib/components/ui-extra/avatar-group/avatar-group.svelte';
import Member from '#lib/components/ui-extra/avatar-group/avatar-group-member.svelte';
import Etc from '#lib/components/ui-extra/avatar-group/avatar-group-etc.svelte';

import { Fallback, Image } from '#lib/components/ui-extra/avatar/index.js';

export { Root, Member, Etc, Image as MemberImage, Fallback as MemberFallback };

export type * from '#lib/components/ui-extra/avatar-group/types.js';
