import { getContact } from '@/lib/content';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactForm } from '@/components/sections/ContactForm';

export default function ContactPage() {
  const data = getContact();
  return (
    <Section id="contact">
      <SectionTitle title={data.title} subtitle={data.subtitle} />
      <div className="grid gap-10 md:grid-cols-5">
        <Reveal from="left" className="h-full md:col-span-2">
          <ContactInfo info={data.info} />
        </Reveal>
        <Reveal from="right" delay={120} className="md:col-span-3">
          <ContactForm email={data.email} />
        </Reveal>
      </div>
    </Section>
  );
}
