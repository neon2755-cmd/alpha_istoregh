import { useState } from 'react';
import Head from 'next/head';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/ui/Modal';
import { formatPrice } from '../../lib/utils';

export default function AdminProducts() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  return (
    <>
      <Head>
        <title>Products — Admin</title>
      </Head>
      <AdminLayout title="Products" subtitle="Manage your store inventory">
        <div className="flex items-center justify-end mb-5">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex h-10 items-center gap-2 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark shadow-smooth"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-border text-sm">
              <thead className="bg-surface-muted">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-subtle">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-ink-subtle"
                  >
                    No products yet. Click "Add product" to create one.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      {showModal && (
        <Modal
          title={editing ? 'Edit product' : 'Add product'}
          onClose={closeModal}
        >
          <p className="text-sm text-ink-muted">
            Product editor coming soon.
          </p>
        </Modal>
      )}
    </>
  );
}