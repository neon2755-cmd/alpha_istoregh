import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Save, Store, MapPin, Image as ImageIcon, CreditCard, Plus, Trash2, Link as LinkIcon, UploadCloud } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { settingsAPI, uploadAPI } from '../../lib/api';

const inputClass =
  'w-full h-11 px-4 text-sm bg-surface-muted border border-transparent rounded-xl text-ink placeholder:text-ink-subtle focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all';
const textareaClass =
  'w-full p-4 text-sm bg-surface-muted border border-transparent rounded-xl text-ink placeholder:text-ink-subtle focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all resize-none';
const labelClass =
  'block text-xs font-bold uppercase tracking-wider text-ink-subtle mb-2';
const cardClass = 'rounded-3xl border border-surface-border bg-white p-8 shadow-sm';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'AlphaiStore',
    logo: { url: '' },
    favicon: { url: '' },
    hero: { title: '', subtitle: '', image: { url: '' } },
    contact: { whatsapp: [''], phones: [''], email: '', address: '', googleMapEmbedUrl: '' },
    payment: { mtnMomo: true, telecel: true, airteltigo: false, card: false, payOnDelivery: true },
    social: { facebook: '', instagram: '', twitter: '', tiktok: '' },
    promoBanners: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    let active = true;
    settingsAPI.get().then(res => {
      if (active && res.settings) {
        setSettings(prev => ({ ...prev, ...res.settings }));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { active = false };
  }, []);

  const handleChange = (section, field, value) => {
    if (section) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleContactArray = (field, index, value) => {
    const newArr = [...(settings.contact[field] || [])];
    newArr[index] = value;
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: newArr }
    }));
  };

  const addContactItem = (field) => {
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: [...(prev.contact[field] || []), ''] }
    }));
  };

  const removeContactItem = (field, index) => {
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: prev.contact[field].filter((_, i) => i !== index) }
    }));
  };

  // Promo Banner Handlers
  const addPromoBanner = () => {
    setSettings(prev => ({
      ...prev,
      promoBanners: [...(prev.promoBanners || []), { title: '', subtitle: '', cta: '', color: '#006989', image: { url: '' }, link: '' }]
    }));
  };

  const removePromoBanner = (index) => {
    setSettings(prev => ({
      ...prev,
      promoBanners: prev.promoBanners.filter((_, i) => i !== index)
    }));
  };

  const handlePromoChange = (index, field, value) => {
    const newPromos = [...(settings.promoBanners || [])];
    newPromos[index] = { ...newPromos[index], [field]: value };
    setSettings(prev => ({ ...prev, promoBanners: newPromos }));
  };

  const handleImageUpload = async (e, section, field = null, promoIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const id = promoIndex !== null ? `promo-${promoIndex}` : (field ? `${section}-${field}` : section);
    setUploading(id);

    try {
      const formData = new FormData();
      formData.append('images', file);
      const res = await uploadAPI.images(formData);
      
      if (res.success && res.images?.length > 0) {
        const imageUrl = res.images[0];
        
        if (promoIndex !== null) {
          const newPromos = [...settings.promoBanners];
          newPromos[promoIndex].image = imageUrl;
          setSettings(prev => ({ ...prev, promoBanners: newPromos }));
        } else if (field) {
          setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: imageUrl }
          }));
        } else {
          setSettings(prev => ({ ...prev, [section]: imageUrl }));
        }
      }
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      alert('Settings saved successfully!');
    } catch (e) {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Settings — Admin</title>
      </Head>
      <AdminLayout title="Settings" subtitle="Configure your storefront layout, branding, and contact info">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* General & Branding Section */}
            <section className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ImageIcon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-ink">Branding & Hero</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Store Name</label>
                  <input type="text" value={settings.storeName} onChange={(e) => handleChange(null, 'storeName', e.target.value)} className={inputClass} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div>
                    <label className={labelClass}>Website Logo</label>
                    <div className="flex items-center gap-4">
                      {settings.logo?.url && <img src={settings.logo.url} alt="Logo" className="h-12 w-12 object-contain bg-surface-muted rounded-xl" />}
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 h-11 bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-border rounded-xl transition-colors text-sm font-semibold">
                        <UploadCloud className="w-4 h-4" />
                        {uploading === 'logo' ? 'Uploading...' : 'Upload Logo'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                      </label>
                    </div>
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <label className={labelClass}>Favicon</label>
                    <div className="flex items-center gap-4">
                      {settings.favicon?.url && <img src={settings.favicon.url} alt="Favicon" className="h-12 w-12 object-contain bg-surface-muted rounded-xl" />}
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 h-11 bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-border rounded-xl transition-colors text-sm font-semibold">
                        <UploadCloud className="w-4 h-4" />
                        {uploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'favicon')} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <label className={labelClass}>Hero Title</label>
                  <input type="text" value={settings.hero?.title || ''} onChange={(e) => handleChange('hero', 'title', e.target.value)} className={inputClass} placeholder="e.g. The Perfect iPhone" />
                </div>
                <div>
                  <label className={labelClass}>Hero Subtitle</label>
                  <input type="text" value={settings.hero?.subtitle || ''} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)} className={inputClass} placeholder="e.g. Discover the latest..." />
                </div>
                <div>
                  <label className={labelClass}>Hero Image</label>
                  <div className="flex items-center gap-4">
                    {settings.hero?.image?.url && <img src={settings.hero.image.url} alt="Hero" className="h-20 w-20 object-cover bg-surface-muted rounded-xl" />}
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 h-11 bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-border rounded-xl transition-colors text-sm font-semibold">
                      <UploadCloud className="w-4 h-4" />
                      {uploading === 'hero-image' ? 'Uploading...' : 'Upload Hero Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hero', 'image')} />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Promo Section */}
            <section className={cardClass}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-ink">Promo Banners</h2>
                </div>
                <button type="button" onClick={addPromoBanner} className="text-sm font-bold text-primary hover:text-primary-dark">
                  + Add Banner
                </button>
              </div>
              <div className="space-y-8">
                {settings.promoBanners?.map((promo, idx) => (
                  <div key={idx} className="p-6 rounded-2xl border border-surface-border bg-surface-muted/30 relative">
                    <button type="button" onClick={() => removePromoBanner(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="space-y-4 pr-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Title</label>
                          <input type="text" value={promo.title || ''} onChange={(e) => handlePromoChange(idx, 'title', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Subtitle</label>
                          <input type="text" value={promo.subtitle || ''} onChange={(e) => handlePromoChange(idx, 'subtitle', e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>CTA Button Text</label>
                          <input type="text" value={promo.cta || ''} onChange={(e) => handlePromoChange(idx, 'cta', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Link URL</label>
                          <input type="text" value={promo.link || ''} onChange={(e) => handlePromoChange(idx, 'link', e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Background Color</label>
                          <input type="color" value={promo.color || '#006989'} onChange={(e) => handlePromoChange(idx, 'color', e.target.value)} className="w-full h-11 p-1 rounded-xl border border-transparent" />
                        </div>
                        <div>
                          <label className={labelClass}>Pattern</label>
                          <select value={promo.pattern || 'none'} onChange={(e) => handlePromoChange(idx, 'pattern', e.target.value)} className={inputClass}>
                            <option value="none">None</option>
                            <option value="dots">Dots</option>
                            <option value="waves">Waves</option>
                            <option value="grid">Grid</option>
                            <option value="lines">Lines</option>
                            <option value="zigzag">Zigzag</option>
                            <option value="cross">Cross</option>
                            <option value="diamonds">Diamonds</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className={labelClass}>Promo Image</label>
                        <div className="flex items-center gap-3">
                          {promo.image?.url && <img src={promo.image.url} alt="Promo" className="h-11 w-11 object-cover rounded-lg" />}
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3 h-11 bg-white border border-surface-border text-ink-muted hover:text-ink rounded-xl text-sm font-semibold">
                            <UploadCloud className="w-4 h-4" />
                            {uploading === `promo-${idx}` ? '...' : 'Upload'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, null, null, idx)} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!settings.promoBanners?.length && <p className="text-sm text-ink-muted">No promo banners added. Click "+ Add Banner" to create one.</p>}
              </div>
            </section>

            {/* Contact & Map Section */}
            <section className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-ink">Contact & Location</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`${labelClass} mb-0`}>WhatsApp Numbers</label>
                    <button type="button" onClick={() => addContactItem('whatsapp')} className="text-xs font-bold text-primary hover:text-primary-dark">+ Add Number</button>
                  </div>
                  <div className="space-y-3">
                    {(Array.isArray(settings.contact?.whatsapp) ? settings.contact.whatsapp : []).map((num, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={num} onChange={(e) => handleContactArray('whatsapp', idx, e.target.value)} className={inputClass} placeholder="+233..." />
                        <button type="button" onClick={() => removeContactItem('whatsapp', idx)} className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Physical Address</label>
                  <textarea rows={2} value={settings.contact?.address || ''} onChange={(e) => handleChange('contact', 'address', e.target.value)} className={textareaClass} placeholder="Enter full address" />
                </div>

                <div>
                  <label className={labelClass}>Google Maps Embed URL</label>
                  <input type="text" value={settings.contact?.googleMapEmbedUrl || ''} onChange={(e) => handleChange('contact', 'googleMapEmbedUrl', e.target.value)} className={inputClass} placeholder="<iframe src=..." />
                </div>
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className={`${cardClass} lg:sticky lg:top-24`}>
              
              {/* Social Media Links */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <LinkIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-ink">Social Links</h2>
                </div>
                <div className="space-y-4">
                  {['facebook', 'instagram', 'twitter', 'tiktok'].map(platform => (
                    <div key={platform}>
                      <label className={labelClass}>{platform}</label>
                      <input type="text" value={settings.social?.[platform] || ''} onChange={(e) => handleChange('social', platform, e.target.value)} className={inputClass} placeholder={`https://${platform}.com/...`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments */}
              <div className="flex items-center gap-3 mb-6 pt-6 border-t border-surface-border">
                <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <CreditCard className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-ink">Payments</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(settings.payment || {}).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between p-3 rounded-xl border border-surface-border cursor-pointer hover:bg-surface-muted transition-colors">
                    <span className="text-sm font-semibold text-ink capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <input type="checkbox" checked={!!value} onChange={(e) => handleChange('payment', key, e.target.checked)} className="w-5 h-5 rounded border-surface-border text-primary focus:ring-primary" />
                  </label>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-surface-border">
                <button type="button" onClick={handleSave} disabled={saving} className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-smooth disabled:opacity-60">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </AdminLayout>
    </>
  );
}