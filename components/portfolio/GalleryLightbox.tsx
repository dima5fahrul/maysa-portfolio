import { LightboxGroup, LightboxThumb } from '@/components/ui/Lightbox';

export function GalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const single = images.length === 1;
  return (
    <LightboxGroup images={images.map((src, i) => ({ src, alt: `${title}, documentation ${i + 1}` }))}>
      <div className={`grid gap-3 ${single ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {images.map((src, i) => (
          <LightboxThumb key={src} index={i} className="rounded" imgClassName={single ? 'aspect-video' : 'aspect-[4/3]'} />
        ))}
      </div>
    </LightboxGroup>
  );
}
