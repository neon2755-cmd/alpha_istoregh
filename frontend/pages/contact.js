import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import {
  Phone,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import siteConfig from '../config';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { settingsAPI, contactAPI } from '../lib/api';

const inputClass =
  'w-full h-12 px-4 text-sm bg-surface-muted border border-surface-border rounded-lg text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors';

const labelClass =
  'block text-sm font-semibold tracking-wide text-ink-muted mb-2';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    settingsAPI.get().then(res => {
      if (active && res.settings) setSettings(res.settings);
    }).catch(() => {});
    return () => { active = false };
  }, []);

  const contactPhone = settings?.contact?.phones?.[0] || settings?.contact?.phone || siteConfig.contact?.phone || '+233 575 453 086';
  const contactEmail = settings?.contact?.email || siteConfig.contact?.email || 'info@alphaistore.com';
  const contactAddress = settings?.contact?.address || siteConfig.contact?.address || 'Adum P.Z, Kumasi, Ghana';
  const whatsappNumber = (settings?.contact?.whatsapp?.[0] || siteConfig.whatsappNumber || '').replace(/[^0-9]/g, '');

  const CONTACTS = [
    {
      Icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: whatsappNumber ? (
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> {contactPhone}
        </a>
      ) : contactPhone,
      sub: 'Available 8am–10pm daily',
      href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined,
    },
    {
      Icon: Phone,
      label: 'Phone',
      value: contactPhone,
      sub: 'Mon–Sat: 9am–6pm',
      href: `tel:${contactPhone.replace(/\s/g, '')}`,
    },
    {
      Icon: Mail,
      label: 'Email',
      value: contactEmail,
      sub: 'Reply within 2 hours',
      href: `mailto:${contactEmail}`,
    },
    {
      Icon: MapPin,
      label: 'Location',
      value: contactAddress,
      sub: contactAddress,
    },
  ];

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please fill your name and message');
      return;
    }
    setLoading(true);
    try {
      await contactAPI.submit({
        name: form.name,
        email: form.email || 'no-email@provided.com',
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      toast.success('Message sent — we will reply shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact — AlphaiStore</title>
      </Head>

      <div className="bg-white border-b border-surface-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tightish text-ink">
            Contact us
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            We are always happy to help. Reach us anytime.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {CONTACTS.map(({ Icon, label, value, sub, href }) => {
            const Wrapper = href ? 'a' : 'div';
            return (
              <Wrapper
                key={label}
                {...(href ? { href } : {})}
                className="rounded-xl border border-surface-border bg-white p-5 flex gap-3 items-start hover:border-ink-subtle"
              >
                <span className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink truncate">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-subtle">{sub}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>

        <section className="rounded-xl border border-surface-border bg-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Send className="h-4 w-4 text-ink-subtle" />
            <h2 className="text-base font-semibold tracking-tightish text-ink">
              Send a message
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Your name</label>
                <input
                  className={inputClass}
                  placeholder="Kwame Asante"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  className={inputClass}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                type="tel"
                placeholder="+233 XX XXX XXXX"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>

            <div>
              <label className={labelClass}>Subject</label>
              <input
                className={inputClass}
                placeholder="Order enquiry, product question…"
                value={form.subject}
                onChange={set('subject')}
              />
            </div>

            <div>
              <label className={labelClass}>Message</label>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="Type your message…"
                rows={5}
                className={`${inputClass} h-auto py-3 resize-y shadow-none`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 px-8 rounded-lg bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-dark disabled:opacity-60 transition-colors"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </section>

        {settings?.contact?.googleMapEmbedUrl && (
          <section className="rounded-xl border border-surface-border bg-white p-2 md:p-4 mt-6">
            <h2 className="text-base font-semibold tracking-tightish text-ink mb-4 px-2">Our Location</h2>
            <div
              className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: settings.contact.googleMapEmbedUrl }}
            />
          </section>
        )}
      </div>
    </>
  );
}