import { ModeToggle } from './ToggleTheme';
import { TypographyH1 } from './ui/typography';
import { UserNav } from './UserNav';

function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
      <TypographyH1 text="FSS AI" className="text-lg font-semibold" />
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  );
}

export default Header;
