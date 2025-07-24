import { ModeToggle } from './ToggleTheme';
import { TypographyH1 } from './ui/typography';

function Header() {
  return (
    <header className=" px-4 py-3 sticky top-0 shadow-md dark:bg-slate-800 bg-slate-100 z-10 flex items-center justify-between">
      <TypographyH1 text="BSP AI" className=" text-lg" />
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
