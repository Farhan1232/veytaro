import type { IconName } from "../content/types";
import {
  BookIcon,
  LaptopIcon,
  LockIcon,
  MailIcon,
  SaveIcon,
  ShieldIcon,
  TableIcon,
  TrophyIcon,
  type IconProps,
} from "./Icons";

/**
 * Looks up an icon by the name used in the content file, so copy and artwork
 * stay together in `de.ts` and the components do not import eight icons each.
 */
const ICONS: Record<IconName, (props: IconProps) => React.ReactElement> = {
  save: SaveIcon,
  shield: ShieldIcon,
  table: TableIcon,
  trophy: TrophyIcon,
  laptop: LaptopIcon,
  lock: LockIcon,
  book: BookIcon,
  mail: MailIcon,
};

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = ICONS[name];
  return <Component size={size} className={className} />;
}
