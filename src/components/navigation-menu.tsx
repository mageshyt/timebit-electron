import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ExternalLink from "./external-link";

export default function NavigationMenu() {
  const { t } = useTranslation();
  const itemClassName =
    "rounded-full border border-zinc-300 bg-white/80 px-3 py-1 text-zinc-600 text-xs transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

  return (
    <nav className="flex items-center gap-2 text-muted-foreground">
      <Link className={itemClassName} to="/">
        {t("titleHomePage")}
      </Link>
      <Link className={itemClassName} to="/second">
        {t("titleSecondPage")}
      </Link>
      <ExternalLink
        className={itemClassName}
        href="https://docs.luanroger.dev/electron-shadcn"
      >
        {t("documentation")}
      </ExternalLink>
    </nav>
  );
}
