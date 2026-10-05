import Link from 'next/link';
import {
  MessageSquare,
  Wand2,
  Send,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Edit,
  Sparkles,
  Clock,
  Layers,
  Mail
} from 'lucide-react';
import { requireAdmin } from '@/lib/admin';
import type { Order } from '@/lib/models';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  let orders: Order[] = [];
  let failure = '';

  try {
    const db = await requireAdmin();
    const { data, error } = await db
      .from('orders')
      .select('id,client_name,email,template_name,status,message,created_at,published_file')
      .order('created_at', { ascending: false });
    if (error) throw error;
    orders = data as Order[];
  } catch {
    failure = 'Could not load dashboard data. Check your session and database setup.';
  }

  // Pure Inquiries from website contact form
  const inquiries = orders.filter(
    (o) => !o.published_file || o.status === 'New Inquiry' || o.status === 'Contacted'
  );

  // Active / Saved Invitation Orders
  const savedOrders = orders.filter(
    (o) => o.published_file || (o.status !== 'New Inquiry' && o.status !== 'Contacted')
  );

  const draftCount = savedOrders.filter(
    (o) => o.status === 'Customizing' || o.status === 'Draft Saved'
  ).length;

  const deliveredCount = savedOrders.filter(
    (o) => o.status === 'Link Delivered'
  ).length;

  const completedCount = savedOrders.filter(
    (o) => o.status === 'Completed'
  ).length;

  const statConfigs = [
    {
      label: 'Client Inquiries',
      count: inquiries.length,
      icon: MessageSquare,
      color: '#f59e0b',
    },
    {
      label: 'Drafts (Saved, Not Sent)',
      count: draftCount,
      icon: Clock,
      color: '#3b82f6',
    },
    {
      label: 'Links Delivered',
      count: deliveredCount,
      icon: Send,
      color: '#a855f7',
    },
    {
      label: 'Completed Celebrations',
      count: completedCount,
      icon: CheckCircle2,
      color: '#10b981',
    },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Atelier Overview</h2>
          <p>Real-time analytics for prospective client inquiries, saved drafts & delivered invitations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/inquiries" className={styles.btnSecondary}>
            View Inquiries ({inquiries.length})
          </Link>
          <Link href="/admin/customize" className={styles.btnPrimary}>
            <Sparkles size={14} /> New Customization
          </Link>
        </div>
      </div>

      {failure ? (
        <div role="alert" className={styles.editorMessage}>
          {failure}
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className={styles.statsGrid}>
            {statConfigs.map(({ label, count, icon: Icon, color }) => (
              <div className={styles.statCard} key={label}>
                <div
                  className={styles.statIcon}
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: `${color}35`,
                    color: color,
                  }}
                >
                  <Icon size={22} />
                </div>
                <div className={styles.statInfo}>
                  <p>{label}</p>
                  <h4>{count}</h4>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1: Recent Client Inquiries from Website */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
              <div
                className={styles.cardHeader}
                style={{
                  padding: '22px 28px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  margin: 0,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={17} color="var(--gold)" />
                    <h3 style={{ margin: 0 }}>Recent Client Inquiries</h3>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                    Leads submitted from the contact form. Review messages and start custom designs.
                  </p>
                </div>
                <Link href="/admin/inquiries" className={styles.btnSecondary}>
                  View All Inquiries <ArrowRight size={13} />
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Occasion</th>
                      <th>Message Snippet</th>
                      <th>Received</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!inquiries.length && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px' }}>
                          <p style={{ color: 'var(--muted)', margin: 0 }}>
                            No client inquiries submitted yet.
                          </p>
                        </td>
                      </tr>
                    )}
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#fff' }}>{inquiry.client_name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{inquiry.email}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#fce7b2',
                            fontSize: '11.5px',
                            fontWeight: 500
                          }}>
                            {inquiry.template_name || 'General Inquiry'}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <span style={{
                            fontSize: '12.5px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {inquiry.message || 'No specific requirements message.'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
                            {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={
                              inquiry.status === 'New Inquiry'
                                ? { background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }
                                : { background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }
                            }
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                            <a
                              href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Regarding your ${inquiry.template_name || 'invitation'} inquiry - WeInviteU`)}`}
                              className={styles.btnSecondary}
                              style={{ padding: '5px 10px', fontSize: '11px' }}
                              title="Reply via Email"
                            >
                              <Mail size={12} /> Reply
                            </a>
                            <Link
                              href={`/admin/customize?order=${inquiry.id}`}
                              className={styles.btnPrimary}
                              style={{ padding: '5px 12px', fontSize: '11px' }}
                              title="Start customizing an invitation for this client"
                            >
                              <Wand2 size={12} /> Customize
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Active Orders & Delivery Pipeline */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
              <div
                className={styles.cardHeader}
                style={{
                  padding: '22px 28px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  margin: 0,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={17} color="var(--gold)" />
                    <h3 style={{ margin: 0 }}>Active Orders & Saved Drafts</h3>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                    Saved 3D invitation drafts and delivery status for guests.
                  </p>
                </div>
                <Link href="/admin/orders" className={styles.btnSecondary}>
                  View All Orders <ArrowRight size={13} />
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Template Assigned</th>
                      <th>Delivery Status</th>
                      <th>Last Updated</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!savedOrders.length && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px' }}>
                          <p style={{ color: 'var(--muted)', margin: 0 }}>
                            No customized invitation orders created yet.
                          </p>
                        </td>
                      </tr>
                    )}
                    {savedOrders.slice(0, 5).map((order) => {
                      const isDelivered = order.status === 'Link Delivered';
                      const isCompleted = order.status === 'Completed';

                      return (
                        <tr key={order.id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, color: '#fff' }}>{order.client_name}</span>
                              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{order.email}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ color: '#fce7b2', fontWeight: 500 }}>
                              {order.template_name || 'Bespoke Invitation'}
                            </span>
                          </td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={
                                isCompleted
                                  ? { background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }
                                  : isDelivered
                                  ? { background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }
                                  : { background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }
                              }
                            >
                              {isCompleted ? 'Completed' : isDelivered ? 'Link Delivered' : 'Draft Saved · Not Sent'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                              <Link
                                href={`/admin/customize?order=${order.id}`}
                                className={styles.btnSecondary}
                                style={{ padding: '5px 10px', fontSize: '11px' }}
                              >
                                <Edit size={12} /> Edit
                              </Link>
                              {order.published_file && (
                                <a
                                  href={`/invite/${order.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.btnPrimary}
                                  style={{ padding: '5px 12px', fontSize: '11px' }}
                                >
                                  <ExternalLink size={12} /> Live
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
