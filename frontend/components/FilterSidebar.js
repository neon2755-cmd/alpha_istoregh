import React from 'react';
import { useRouter } from 'next/router';

const inputClass =
  'w-full h-10 px-3 text-sm bg-white border border-surface-border rounded-xl text-ink focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-shadow';

export default function FilterSidebar({ filters, onFilterChange }) {
  const router = useRouter();

  const handleChange = (key, value) => {
    onFilterChange(key, value);
    const next = { ...router.query, [key]: value || undefined };
    router.replace({ pathname: router.pathname, query: next }, undefined, {
      shallow: true,
    });
  };

  return (
    <aside className="w-full md:w-64 bg-white border border-surface-border rounded-2xl p-5 space-y-5">
      <h3 className="text-sm font-semibold tracking-tightish text-ink">
        Filters
      </h3>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-ink-subtle mb-1.5">
          Brand
        </label>
        <select
          value={filters.brand || ''}
          onChange={(e) => handleChange('brand', e.target.value)}
          className={inputClass}
        >
          <option value="">All brands</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Google">Google Pixel</option>
          <option value="Xiaomi">Xiaomi</option>
          <option value="Tecno">Tecno</option>
          <option value="Infinix">Infinix</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-ink-subtle mb-1.5">
          Condition
        </label>
        <select
          value={filters.condition || ''}
          onChange={(e) => handleChange('condition', e.target.value)}
          className={inputClass}
        >
          <option value="">All conditions</option>
          <option value="Brand New">Brand new</option>
          <option value="UK Used">UK used</option>
          <option value="Ghana Used">Ghana used</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-ink-subtle mb-1.5">
          Storage
        </label>
        <select
          value={filters.storage || ''}
          onChange={(e) => handleChange('storage', e.target.value)}
          className={inputClass}
        >
          <option value="">All storage</option>
          <option value="64">64GB</option>
          <option value="128">128GB</option>
          <option value="256">256GB</option>
          <option value="512">512GB</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-ink-subtle mb-1.5">
          Max price ({'₵'})
        </label>
        <input
          type="number"
          min="0"
          value={filters.maxPrice || ''}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          placeholder="e.g. 5000"
          className={inputClass}
        />
      </div>
    </aside>
  );
}