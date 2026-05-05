import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const booking = body?.data || body || {};

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'bohemianhouse2030@gmail.com',
      from_name: 'Bohemian House Website',
      subject: `🌿 New Consultation Booking — ${booking.service_type || 'Interior Design'}`,
      body: `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5EFE6; padding: 40px; border-radius: 12px;">
  <h2 style="color: #3D2B1E; font-size: 28px; margin-bottom: 8px;">New Consultation Request</h2>
  <p style="color: #A05035; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 0;">Bohemian House — Interior Design Studio</p>
  <hr style="border: none; border-top: 1px solid #E9DFC6; margin: 24px 0;" />
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #7C563D; font-size: 13px; width: 40%;">Client Name</td><td style="padding: 8px 0; color: #3D2B1E; font-weight: bold;">${booking.client_name || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #7C563D; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #3D2B1E;">${booking.email || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #7C563D; font-size: 13px;">Phone</td><td style="padding: 8px 0; color: #3D2B1E;">${booking.phone || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #7C563D; font-size: 13px;">Service</td><td style="padding: 8px 0; color: #A05035; font-weight: bold;">${booking.service_type || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #7C563D; font-size: 13px;">Budget Range</td><td style="padding: 8px 0; color: #3D2B1E;">${booking.budget_range || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #7C563D; font-size: 13px;">Preferred Date</td><td style="padding: 8px 0; color: #3D2B1E;">${booking.preferred_date || '—'}</td></tr>
  </table>
  ${booking.project_description ? `
  <hr style="border: none; border-top: 1px solid #E9DFC6; margin: 24px 0;" />
  <p style="color: #7C563D; font-size: 13px; margin-bottom: 8px;">Project Description</p>
  <p style="color: #3D2B1E; font-size: 14px; line-height: 1.7; background: white; padding: 16px; border-radius: 8px; border-left: 3px solid #A05035;">${booking.project_description}</p>
  ` : ''}
  <hr style="border: none; border-top: 1px solid #E9DFC6; margin: 24px 0;" />
  <p style="color: #B88D6A; font-size: 12px; text-align: center;">Bohemian House · New Cairo, Egypt · bohemianhouse2030@gmail.com</p>
</div>
      `
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending booking notification:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});