import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import type { Order } from '@/lib/models';
import styles from './admin.module.css';
export default async function AdminDashboard() {
  let orders: Order[] = [];
  let failure = '';
  try {
    const db = await requireAdmin();
    const { data, error } = await db.from('orders').select('id,client_name,email,template_name,status,created_at').order('created_at', { ascending: false });
    if (error) throw error;
    orders = data as Order[];
  } catch { failure = 'Could not load dashboard data. Check your session and database setup.'; }
  const stats = [
    ['New Inquiries', orders.filter(o => o.status === 'New Inquiry').length],
    ['Customizing', orders.filter(o => o.status === 'Customizing').length],
    ['Links Delivered', orders.filter(o => o.status === 'Link Delivered').length],
    ['Completed', orders.filter(o => o.status === 'Completed').length],
  ];
  return <div>
    <div className={styles.pageHeader}><div><h2>Dashboard Overview</h2><p>Your latest inquiries and orders.</p></div></div>
    {failure ? <p role="alert">{failure}</p> : <>
      <div className={styles.statsGrid}>{stats.map(([label, count]) => <div className={styles.statCard} key={label}><div className={styles.statInfo}><p>{label}</p><h4>{count}</h4></div></div>)}</div>
      <div className={styles.card} style={{ overflowX: 'auto' }}><div className={styles.cardHeader}><h3>Recent Inquiries & Orders</h3><Link href="/admin/orders" className={styles.btnSecondary}>View All</Link></div>
        <table className={styles.table}><thead><tr><th>Client</th><th>Template</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>
          {!orders.length && <tr><td colSpan={5}>No inquiries yet.</td></tr>}
          {orders.slice(0, 10).map(o => <tr key={o.id}><td>{o.client_name}</td><td>{o.template_name}</td><td>{new Date(o.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</td><td>{o.status}</td><td><Link href={`/admin/customize?order=${o.id}`}>Edit</Link></td></tr>)}
        </tbody></table>
      </div>
    </>}
  </div>;
}
