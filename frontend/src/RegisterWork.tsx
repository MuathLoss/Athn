import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function RegisterWork() {
  const client = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image || !title.trim() || loading) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const body = new FormData();

      body.append('image', image);
      body.append('title', title.trim());

      const base = import.meta.env.VITE_IDHN_API_BASE_URL;

      const response = await fetch(
        new URL('/register', base),
        {
          method: 'POST',
          credentials: 'include',
          body
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('يرجى تسجيل الدخول مجددا');
        }

        if (response.status === 403) {
          throw new Error('غير مصرح لك بتسجيل المصنف');
        }

        throw new Error('تعذر تسجيل المصنف');
      }

      const result = await response.json();

      setMessage(
        'تم تسجيل المصنف بنجاح: ' + result.registration_id
      );

      setTitle('');
      setImage(null);
      setOpen(false);

      await Promise.all([
        client.invalidateQueries({ queryKey: ['works'] }),
        client.invalidateQueries({ queryKey: ['overview'] })
      ]);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'حدث خطأ أثناء التسجيل'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="registry-ledger"
      style={{ padding: '20px', marginBottom: '20px' }}
    >
      <button
        className="button"
        disabled={loading}
        onClick={() => setOpen(!open)}
      >
        {open ? 'إلغاء' : '+ إضافة مصنف'}
      </button>

      {message && (
        <p role="status" style={{ color: '#15803d' }}>
          {message}
        </p>
      )}

      {open && (
        <form
          onSubmit={register}
          style={{
            display: 'grid',
            gap: '16px',
            marginTop: '20px'
          }}
        >
          <h2>تسجيل مصنف جديد</h2>

          <label className="field">
            اسم المصنف
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ادخل اسم المصنف"
              maxLength={200}
              required
            />
          </label>

          <label className="field">
            صورة المصنف
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e =>
                setImage(e.target.files?.[0] ?? null)
              }
              required
            />
          </label>

          <button
            className="button"
            type="submit"
            disabled={loading || !image || !title.trim()}
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل المصنف'}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </section>
  );
}
