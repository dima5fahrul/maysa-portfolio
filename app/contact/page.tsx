import { getContact } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactForm } from '@/components/sections/ContactForm';

export default function ContactPage() {
  const data = getContact();
  return (
    <Section id="contact">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-10 md:grid-cols-2">
        <ContactInfo info={data.info} mapEmbedUrl={data.mapEmbedUrl} />
        <ContactForm email={data.email} />
      </div>
    </Section>
  );
}
