import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/lib/schema';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <span
        className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
        style={{ backgroundColor: service.color }}
      >
        <Icon name={service.icon} />
      </span>
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 text-muted">{service.description}</p>
    </div>
  );
}
