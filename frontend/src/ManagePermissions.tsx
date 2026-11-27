import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthorizationRecord } from './domain';

type Props = {
  workId: string;
  authorizations: AuthorizationRecord[];
};

const sellers = [
  { id: 'seller_a', name: 'البائع أ' },
  { id: 'seller_b', name: 'البائع ب' }
];

export default function ManagePermissions({
  workId,
  authorizations
}: Props) {
  const client = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function updatePermission(
    sellerId: string,
    authorized: boolean
  ) {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const base = import.meta.env.VITE_IDHN_API_BASE_URL;

      const path =
        '/portal/works/' +
        encodeURIComponent(workId) +
        '/permissions/' +
        encodeURIComponent(sellerId);

      const response = await fetch(
        new URL(path, base),
        {
          method: authorized ? 'DELETE' : 'PUT',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('تعذر تحديث الإذن');
      }

      await Promise.all([
        client.invalidateQueries({
          queryKey: ['work', workId]
        }),
        client.invalidateQueries({
          queryKey: ['works']
        }),
        client.invalidateQueries({
          queryKey: ['overview']
        })
      ]);

      setMessage(
        authorized
          ? 'تم إلغاء الإذن بنجاح'
          : 'تم منح الإذن بنجاح'
      );

    } catch {
      setError('حدث خطأ أثناء تحديث الإذن');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="registry-ledger"
      style={{ padding: '20px', marginBottom: '20px' }}
    >
      <h2>إدارة أذونات الاستخدام</h2>

      {sellers.map(seller => {
        const authorized = authorizations.some(
          record =>
            record.seller_id === seller.id &&
            record.status === 'authorized'
        );

        return (
          <div
            key={seller.id}
            className="ledger-row"
            style={{ padding: '16px 0' }}
          >
            <span className="row-main">
              <strong>{seller.name}</strong>
              <small>{seller.id}</small>

              <small style={{
                color: authorized ? '#15803d' : '#b91c1c'
              }}>
                {authorized ? 'مصرح له' : 'لا يوجد إذن مسجل'}
              </small>
            </span>

            <button
              className={
                authorized ? 'button secondary' : 'button'
              }
              disabled={loading}
              onClick={() =>
                updatePermission(seller.id, authorized)
              }
            >
              {authorized ? 'إلغاء الإذن' : 'منح الإذن'}
            </button>
          </div>
        );
      })}

      {message && (
        <p role="status" style={{ color: '#15803d' }}>
          {message}
        </p>
      )}

      {error && (
        <p role="alert" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </section>
  );
}
