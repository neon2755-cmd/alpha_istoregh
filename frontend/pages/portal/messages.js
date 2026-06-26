import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Mail, MessageSquare, Trash2, Check, CheckCheck } from 'lucide-react';
import AdminLayout from '../../components/portal/AdminLayout';
import withAdminAuth from '../../components/portal/withAdminAuth';
import { contactAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await contactAPI.getAll();
      setMessages(res.messages || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkReplied = async (id) => {
    try {
      await contactAPI.markReplied(id);
      await fetchMessages();
      toast.success('Updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactAPI.delete(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <Head>
        <title>Messages — Admin</title>
      </Head>
      <AdminLayout title="Messages" subtitle="Customer contact form submissions">
        {loading ? (
          <div className="rounded-2xl border border-surface-border bg-white p-12 text-center text-ink-muted">
            Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-surface-border bg-white p-12 text-center">
            <Mail className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
            <p className="text-sm font-medium text-ink-muted">No messages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => setSelected(msg)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    selected?._id === msg._id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-surface-border bg-white hover:border-ink-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-ink truncate">{msg.name}</p>
                    {msg.replied && <CheckCheck className="h-4 w-4 text-green-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-ink-subtle truncate">{msg.subject || msg.message}</p>
                  <p className="text-[10px] text-ink-subtle mt-1">
                    {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2">
              {selected ? (
                <div className="rounded-2xl border border-surface-border bg-white p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-ink">{selected.name}</h2>
                      <p className="text-sm text-ink-subtle">{selected.email} {selected.phone && `· ${selected.phone}`}</p>
                      <p className="text-xs text-ink-subtle mt-1">
                        {new Date(selected.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkReplied(selected._id)}
                        className={`inline-flex items-center gap-1 h-9 px-4 rounded-xl text-xs font-bold transition-colors ${
                          selected.replied
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-surface-muted text-ink-muted border border-surface-border hover:bg-primary-50 hover:text-primary'
                        }`}
                      >
                        {selected.replied ? <CheckCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                        {selected.replied ? 'Replied' : 'Mark as read'}
                      </button>
                      <button
                        onClick={() => handleDelete(selected._id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {selected.subject && (
                    <p className="text-sm font-semibold text-ink mb-2">Subject: {selected.subject}</p>
                  )}
                  <div className="rounded-xl bg-surface-muted p-4">
                    <p className="text-sm text-ink whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a
                      href={`mailto:${selected.email}`}
                      className="inline-flex h-10 items-center gap-2 px-5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark"
                    >
                      Reply via Email
                    </a>
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="inline-flex h-10 items-center gap-2 px-5 rounded-xl border border-surface-border bg-white text-ink text-sm font-bold hover:bg-surface-muted"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-surface-border bg-white p-12 text-center">
                  <MessageSquare className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
                  <p className="text-sm font-medium text-ink-muted">Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export default withAdminAuth(AdminMessages);
