import { getContact, getSite } from '@/lib/content';
import { ContactSection } from '@/components/sections/ContactSection';

export default function ContactPage() {
  return <ContactSection data={getContact()} site={getSite()} />;
}
