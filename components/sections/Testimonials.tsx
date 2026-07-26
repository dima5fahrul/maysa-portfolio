'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Icon } from '@/components/ui/Icon';
import type { AboutContent } from '@/lib/schema';

export function Testimonials({ data }: { data: AboutContent['testimonials'] }) {
  return (
    <Section id="testimonials" className="bg-surface">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        spaceBetween={24}
        className="pb-12"
      >
        {data.items.map((t) => (
          <SwiperSlide key={t.name}>
            <div className="mx-auto max-w-2xl rounded bg-white p-8 text-center shadow">
              <img src={t.image} alt={t.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
              <h3 className="mt-4 text-lg font-semibold">{t.name}</h3>
              <h4 className="text-sm text-muted">{t.role}</h4>
              <div className="mt-2 flex justify-center gap-1 text-yellow-400">
                {Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="star-fill" />)}
              </div>
              <p className="mt-4 italic text-muted">{t.quote}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
}
