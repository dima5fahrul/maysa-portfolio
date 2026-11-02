import { getContact } from '@/lib/content';
import { ContactSection } from '@/components/sections/ContactSection';

export default function ContactPage() {
  return <ContactSection data={getContact()} />;
}
