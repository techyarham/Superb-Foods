interface EmailVerifyProp {
  name: string;
  otp: string;
}

interface loginAlertProp {
  name: string;
  device: string;
  loginTime: string;
}

interface orderRecievedEmailProp {
  name: string;
  orderId: string;
  total: number;
  time: string;
}

interface orderPlacedProp {
  name: string;
  orderId: string;
  total: number;
}

interface orderConfirmedEmailProps {
  name: string;
  orderId: string;
  time: string;
}

interface orderRejectedEmailProps {
  name: string;
  orderId: string;
}

export const verifyEmail = ({ name, otp }: EmailVerifyProp): string => {
  return `
  <!DOCTYPE html>
<html>
<body style="margin:0;background:#FAF7F2;font-family:Arial;color:#2C2C2C;">
<table width="100%">
<tr><td align="center">
<table width="600" style="background:#ffffff;margin:24px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.08);">

<tr>
<td style="background:#27AE60;color:#fff;text-align:center;padding:32px;border-radius:10px 10px 0 0;">
<h1 style="margin:0;">Verify Your Email</h1>
<p style="margin-top:8px;opacity:.9;">Superb Foods</p>
</td>
</tr>

<tr>
<td style="padding:36px;text-align:center;">
<p>Hi <strong>${name}</strong>,</p>
<p>Use the OTP below to verify your email address:</p>

<div style="margin:28px 0;padding:18px 28px;border-radius:8px;
background:#FAF7F2;font-size:34px;letter-spacing:6px;
font-weight:bold;color:#C0392B;">
${otp}
</div>

<p style="font-size:14px;color:#555;">OTP expires in 10 minutes</p>

<p style="margin-top:30px;">Thanks for choosing <strong>Superb Foods</strong> 🍴</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
};

export const loginAlertEmail = ({
  name,
  device,
  loginTime,
}: loginAlertProp): string => {
  return `
  <!DOCTYPE html>
<html>
<body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#2C2C2C;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center">
<table width="600" style="background:#ffffff;margin:24px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
  
<tr>
<td style="padding:28px;background:#C0392B;color:#fff;border-radius:10px 10px 0 0;">
<h1 style="margin:0;font-size:26px;">Superb Foods</h1>
<p style="margin:6px 0 0;font-size:14px;opacity:.9;">Security Login Alert</p>
</td>
</tr>

<tr>
<td style="padding:32px;">
<p>Hello <strong>${name}</strong>,</p>
<p>We detected a successful login to your account with the following details:</p>

<table style="margin:20px 0;font-size:14px;">
<tr><td><strong>Time</strong></td><td style="padding-left:12px;">${loginTime}</td></tr>
<tr><td><strong>Device</strong></td><td style="padding-left:12px;">${device}</td></tr>
</table>

<p>If this was you, you're all set.</p>
<p style="color:#C0392B;font-weight:bold;">If not, please reset your password immediately.</p>

<p style="margin-top:30px;">— Superb Foods Security Team</p>
</td>
</tr>

<tr>
<td style="text-align:center;padding:16px;font-size:12px;color:#888;">
© 2026 Superb Foods
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
};

export const orderRecievedEmail = ({
  name,
  orderId,
  total,
  time,
}: orderRecievedEmailProp): string => {
  return `
 <!DOCTYPE html>
<html>
<body style="background:#FAF7F2;font-family:Arial;">
<table width="100%">
<tr><td align="center">
<table width="600" style="background:#fff;margin:24px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<tr>
<td style="background:#2C2C2C;color:#fff;padding:26px;border-radius:10px 10px 0 0;">
<h2 style="margin:0;">New Order Received</h2>
</td>
</tr>

<tr>
<td style="padding:30px;">
<p><strong>Order ID:</strong> ${orderId}</p>
<p><strong>Customer:</strong> ${name}</p>
<p><strong>Total Amount:</strong> Rs ${total}</p>
<p><strong>Time:</strong> ${time}</p>

<hr style="margin:24px 0;border:none;border-top:1px solid #eee;">

<p>Please review and confirm the order from the admin panel.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
};

export const orderPlacedEmail = ({
  name,
  orderId,
  total,
}: orderPlacedProp): string => {
  return `
 <!DOCTYPE html>
<html>
<body style="background:#FAF7F2;font-family:Arial;">
<table width="100%">
<tr><td align="center">
<table width="600" style="background:#fff;margin:24px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.08);">

<tr>
<td style="background:#E67E22;color:#fff;text-align:center;padding:28px;border-radius:10px 10px 0 0;">
<h2>Order Placed Successfully</h2>
</td>
</tr>

<tr>
<td style="padding:32px;">
<p>Hello <strong>${name}</strong>,</p>
<p>Your order has been placed successfully and is awaiting confirmation.</p>

<p><strong>Order ID:</strong> ${orderId}</p>
<p><strong>Total Amount:</strong> Rs ${total}</p>

<p style="margin-top:24px;">We'll notify you once it's confirmed.</p>

<p>Thank you for choosing <strong>Superb Foods</strong> ❤️</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
};

export const orderConfirmedEmail = ({
  name,
  orderId,
  time,
}: orderConfirmedEmailProps): string => {
  return `
<!DOCTYPE html>
<html>
<body style="background:#FAF7F2;font-family:Arial;">
<table width="100%">
<tr><td align="center">
<table width="600" style="background:#fff;margin:24px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.08);">

<tr>
<td style="background:#27AE60;color:#fff;text-align:center;padding:30px;border-radius:10px 10px 0 0;">
<h2>Order Confirmed 🎉</h2>
</td>
</tr>

<tr>
<td style="padding:34px;">
<p>Hi <strong>${name}</strong>,</p>
<p>Your order has been confirmed and is now being prepared.</p>

<p><strong>Order ID:</strong> ${orderId}</p>
<p><strong>Estimated Delivery:</strong> ${time}</p>

<p style="margin-top:24px;">We can't wait to serve you 🍲</p>

<p>— <strong>Superb Foods Team</strong></p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
};

export const orderRejectedEmail = ({
  name,
  orderId,
}: orderRejectedEmailProps): string => {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#2C2C2C;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center">
<table width="600" style="background:#ffffff;margin:24px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
  
<tr>
<td style="padding:28px;background:#C0392B;color:#fff;border-radius:10px 10px 0 0;">
<h1 style="margin:0;font-size:26px;">Superb Foods</h1>
<p style="margin:6px 0 0;font-size:14px;opacity:.9;">Order not accepted</p>
</td>
</tr>

<tr>
<td style="padding:32px;">
<p>Hello <strong>${name}</strong>,</p>
<p>Your order ${orderId} was not accepted due to some reasons.</p>
<p style="color:#C0392B;font-weight:bold;">Please contact our helpline.</p>

<p style="margin-top:30px;">— Superb Foods Team</p>
</td>
</tr>

<tr>
<td style="text-align:center;padding:16px;font-size:12px;color:#888;">
© 2026 Superb Foods
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
};
