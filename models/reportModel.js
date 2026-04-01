import pool from "../config/db.js";

export const getAdminStats = async () => {
  const queries = {
    // 1. Top Metrics
    metrics: `
      SELECT 
        (SELECT COALESCE(SUM(amount), 0) FROM sponsorships WHERE type = 'money') as total_revenue,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'enrolled') as active_enrollments,
        (SELECT ROUND((COUNT(CASE WHEN approved THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100, 1) FROM project_reviews) as success_rate
    `,

    // 2. Registration Trend (Last 6 Months)
    registrations: `
      SELECT 
        to_char(created_at, 'Mon') as month,
        COUNT(*) as count,
        extract(month from created_at) as month_num
      FROM users 
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY month, month_num
      ORDER BY month_num ASC
    `,

    // 3. Sponsorship Table Breakdown
    sponsorships: `
      SELECT 
        u.name as sponsor_name,
        s.type,
        s.amount,
        s.description,
        s.created_at as last_active
      FROM sponsorships s
      JOIN users u ON s.sponsor_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 10
    `
  };

  const [metrics, regs, sponsors] = await Promise.all([
    pool.query(queries.metrics),
    pool.query(queries.registrations),
    pool.query(queries.sponsorships)
  ]);

  return {
    metrics: metrics.rows[0],
    registrationTrend: regs.rows,
    sponsorships: sponsors.rows
  };
};
