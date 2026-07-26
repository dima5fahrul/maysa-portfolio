import { Icon } from '@/components/ui/Icon';
import type { ContactContent } from '@/lib/schema';

export function ContactInfo({ info, mapEmbedUrl }: { info: ContactContent['info']; mapEmbedUrl: string }) {
  return (
    <div className="space-y-6">
      {info.map((i) => (
        <div key={i.title} className="flex items-start gap-4">
          <Icon name={i.icon} className="text-2xl text-accent" />
          <div>
            <h3 className="font-semibold">{i.title}</h3>
            <p className="text-muted">{i.text}</p>
          </div>
        </div>
      ))}
      <iframe src={mapEmbedUrl} className="h-64 w-full rounded border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
    </div>
  );
}
