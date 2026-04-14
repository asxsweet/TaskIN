import nodemailer from "nodemailer";
import type { WorkStatus } from "@prisma/client";

const FOOTER = `
  <p style="margin-top:24px;font-size:12px;color:#737373;">
    Task IN — Білімді бөліс. Болашақты жаса.<br/>
    © 2024 Task IN
  </p>
`;

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@taskin.kz";
  const transport = getTransport();
  if (!transport) {
    console.warn("SMTP not configured; email skipped:", opts.subject);
    return;
  }
  await transport.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html + FOOTER });
}

export async function notifyWorkStatus(studentEmail: string, workTitle: string, status: WorkStatus) {
  const map: Record<WorkStatus, { subject: string; html: string }> = {
    APPROVED: {
      subject: "Жұмысыңыз бекітілді — Task IN",
      html: `<p>Сіздің жұмысыңыз бекітілді.</p><p><strong>${escapeHtml(workTitle)}</strong></p>`,
    },
    RETURNED: {
      subject: "Жұмысыңыз қайтарылды — Task IN",
      html: `<p>Сіздің жұмысыңыз түзетуге қайтарылды.</p><p><strong>${escapeHtml(workTitle)}</strong></p>`,
    },
    REJECTED: {
      subject: "Жұмысыңыз қабылданбады — Task IN",
      html: `<p>Сіздің жұмысыңыз қабылданбады.</p><p><strong>${escapeHtml(workTitle)}</strong></p>`,
    },
    PENDING: {
      subject: "Жұмыс тексеруде — Task IN",
      html: `<p>Сіздің жұмысыңыз тексеруге жіберілді.</p><p><strong>${escapeHtml(workTitle)}</strong></p>`,
    },
  };
  const m = map[status];
  await sendMail({ to: studentEmail, subject: m.subject, html: m.html });
}

export async function notifyNewReview(studentEmail: string, workTitle: string) {
  await sendMail({
    to: studentEmail,
    subject: "Жұмысыңыз бағаланды — Task IN",
    html: `<p>Жұмысыңызға баға берілді.</p><p><strong>${escapeHtml(workTitle)}</strong></p>`,
  });
}

export async function notifySupervisorAssigned(supervisorEmail: string, workTitle: string) {
  await sendMail({
    to: supervisorEmail,
    subject: "Жаңа жұмыс тағайындалды — Task IN",
    html: `<p>Сізге жаңа жұмыс жетекшілікке берілді.</p><p><strong>${escapeHtml(workTitle)}</strong></p>`,
  });
}

export async function notifyAdminsNewSupervisorRequest(opts: {
  adminEmail: string;
  name: string;
  email: string;
  faculty: string;
  position: string;
  employeeId: string;
  submittedAt: Date;
  approvalsUrl: string;
}) {
  const t = opts.submittedAt.toLocaleString("kk-KZ");
  await sendMail({
    to: opts.adminEmail,
    subject: "Жаңа жетекші өтінімі — Task IN",
    html: `
      <p>Жаңа жетекші тіркелу өтінімі келді.</p>
      <p><strong>Аты-жөні:</strong> ${escapeHtml(opts.name)}<br/>
      <strong>Email:</strong> ${escapeHtml(opts.email)}<br/>
      <strong>Факультет:</strong> ${escapeHtml(opts.faculty)}<br/>
      <strong>Қызметі:</strong> ${escapeHtml(opts.position)}<br/>
      <strong>Куәлік №:</strong> ${escapeHtml(opts.employeeId)}<br/>
      <strong>Уақыты:</strong> ${escapeHtml(t)}</p>
      <p><a href="${escapeHtml(opts.approvalsUrl)}">Бекіту үшін мына сілтемеге өтіңіз</a></p>
    `,
  });
}

export async function notifySupervisorApproved(supervisorEmail: string, name: string, loginUrl: string) {
  await sendMail({
    to: supervisorEmail,
    subject: "Өтініміңіз бекітілді — Task IN",
    html: `
      <p>Сәлем ${escapeHtml(name)},</p>
      <p>Сіздің жетекші ретінде тіркелу өтінімі бекітілді!</p>
      <p>Енді жүйеге кіре аласыз: <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a></p>
    `,
  });
}

export async function notifySupervisorRejected(supervisorEmail: string, name: string, note: string) {
  await sendMail({
    to: supervisorEmail,
    subject: "Өтініміңіз қабылданбады — Task IN",
    html: `
      <p>Сәлем ${escapeHtml(name)},</p>
      <p>Өкінішке орай, өтініміңіз қабылданбады.</p>
      <p><strong>Себебі:</strong> ${escapeHtml(note)}</p>
    `,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
