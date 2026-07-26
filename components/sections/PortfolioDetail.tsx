'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { PortfolioItem } from '@/lib/schema';

export function PortfolioDetail({ item }: { item: PortfolioItem }) {
  const { detail } = item;
  return (
    <Section id="portfolio-details">
      <SectionTitle title="Portfolio Details" />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Swiper modules={[Autoplay, Pagination]} loop autoplay={{ delay: 5000 }} pagination={{ clickable: true }} className="pb-10">
            {detail.gallery.map((src) => (
              <SwiperSlide key={src}><img src={src} alt={item.title} className="w-full rounded object-cover" /></SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          <div className="rounded bg-surface p-6">
            <h3 className="mb-3 text-lg font-semibold">Project information</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Category</strong>: <span>{detail.info.category}</span></li>
              <li><strong>Client</strong>: <span>{detail.info.client}</span></li>
              <li><strong>Project date</strong>: <span>{detail.info.date}</span></li>
              <li><strong>Project URL</strong>: <a href={detail.info.url}>{detail.info.url}</a></li>
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">{detail.title}</h2>
            <p className="mt-2 text-muted">{detail.description}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
