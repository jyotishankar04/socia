import nodemailer from 'nodemailer';
import _env from '.';

const mailPort = parseInt(_env.MAIL_PORT || "1025");
const mailUser = _env.MAIL_USERNAME.trim();
const mailPassword = _env.MAIL_PASSWORD.trim();
const useAuth = mailUser.length > 0 && mailPassword.length > 0;
const secure = _env.MAIL_ENCRYPTION === "ssl" || _env.MAIL_ENCRYPTION === "tls" || mailPort === 465;

const transporter = nodemailer.createTransport({
    host: _env.MAIL_HOST,
    port: mailPort,
    secure,
    auth: useAuth ? {
        user: mailUser,
        pass: mailPassword,
    } : undefined,
});

const sendMail = async (mailOptions: { to: string | string[]; subject: string; html: string; }) => {
    try {
        const to = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
        const res = await transporter.sendMail({
            from: useAuth ? mailUser : "no-reply@socia.local",
            to,
            subject: mailOptions.subject,
            html: mailOptions.html,
        });
        return res;
    } catch (error) {
        console.error("Mail send error:", error);
        throw error;
    }
};

export default transporter;
export { sendMail };
