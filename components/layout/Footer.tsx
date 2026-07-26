import { SocialLinks } from './SocialLinks';
import type { SiteContent } from '@/lib/schema';

export function Footer({ site }: { site: SiteContent }) {
  return (
    <footer className="bg-surface py-10 text-center">
      <div className="mx-auto w-full max-w-6xl px-4">
        <p className="text-sm">
          © <span>Copyright</span> <strong className="px-1">{site.copyrightName}</strong>
          <span>All Rights Reserved</span>
        </p>
        <SocialLinks links={site.social} className="mt-4 justify-center" />
        <p className="mt-4 text-xs text-muted">
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </p>
      </div>
    </footer>
  );
}
