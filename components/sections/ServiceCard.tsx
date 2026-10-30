import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/lib/schema';

export function ServiceCard({ service }: { service: Service }) {
  // Hover styles hang off `group`, so a card without an image keeps its plain look.
  return (
    <div
      className={`${service.image ? 'group' : ''} relative flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white p-8 shadow-sm transition-shadow hover:shadow-md`}
    >
      {service.image && (
        <>
          <img
            src={service.image}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </>
      )}
      <div className="relative flex flex-1 flex-col">
        <span
          className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
          style={{ backgroundColor: service.color }}
        >
          <Icon name={service.icon} />
        </span>
        <h3 className="text-lg font-semibold transition-colors duration-500 group-hover:text-white">{service.title}</h3>
        <p className="mt-2 text-muted transition-colors duration-500 group-hover:text-white/85">{service.description}</p>
        {service.category && (
          <Link
            href={`/portfolio/?category=${service.category}`}
            className="mt-auto self-start pt-5 text-sm font-semibold text-accent transition-colors duration-500 hover:underline group-hover:text-white"
          >
            See related work →
          </Link>
        )}
      </div>
    </div>
  );
}
