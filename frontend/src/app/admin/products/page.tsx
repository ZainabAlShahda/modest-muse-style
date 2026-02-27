'use client';

import { useState } from 'react';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import { Plus, X } from 'lucide-react';

export default function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const openCreate = () => { setEditProduct(null); setShowForm(true); };
  const openEdit = (product: any) => { setEditProduct(product); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditProduct(null); };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <ProductTable onEdit={openEdit} />

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-sand-100">
              <h2 className="font-serif text-2xl text-charcoal">
                {editProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={closeForm} className="p-1 text-charcoal-muted hover:text-charcoal transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-6">
              <ProductForm
                product={editProduct}
                onSuccess={() => { closeForm(); window.location.reload(); }}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
