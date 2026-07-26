'use client';
import { useState } from 'react';

export function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all fields.');
      setSent(false);
      return;
    }
    setError('');
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    const subject = encodeURIComponent(form.subject);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = 'w-full rounded border border-black/15 px-3 py-2 focus:border-accent focus:outline-none';

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name-field" className="mb-1 block text-sm">Your Name</label>
          <input id="name-field" className={field} value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label htmlFor="email-field" className="mb-1 block text-sm">Your Email</label>
          <input id="email-field" type="email" className={field} value={form.email} onChange={update('email')} />
        </div>
      </div>
      <div>
        <label htmlFor="subject-field" className="mb-1 block text-sm">Subject</label>
        <input id="subject-field" className={field} value={form.subject} onChange={update('subject')} />
      </div>
      <div>
        <label htmlFor="message-field" className="mb-1 block text-sm">Message</label>
        <textarea id="message-field" rows={8} className={field} value={form.message} onChange={update('message')} />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {sent && <p className="text-green-600">Your message has been sent. Thank you!</p>}
      <div className="text-center">
        <button type="submit" className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase text-white hover:bg-accent/85">
          Send Message
        </button>
      </div>
    </form>
  );
}
