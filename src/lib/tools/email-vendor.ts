import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is not set");
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export interface EmailVendorParams {
  vendorName: string;
  vendorEmail: string;
  projectName: string;
  materialList: string[];
}

export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
  vendorName: string;
}

function buildRfqHtml(projectName: string, materials: string[]): string {
  const itemsHtml = materials
    .map((m) => `<li>${m}</li>`)
    .join("\n");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #024873;">Solicitud de Cotización — Findr.ai</h2>
      <p>Estimado proveedor,</p>
      <p>Estamos solicitando una cotización para el proyecto <strong>${projectName}</strong> con los siguientes materiales:</p>
      <ul>${itemsHtml}</ul>
      <p>Por favor incluir en su cotización:</p>
      <ul>
        <li>Precio unitario (indicar si incluye IVA)</li>
        <li>Disponibilidad de inventario</li>
        <li>Tiempo estimado de entrega</li>
        <li>Condiciones de pago</li>
      </ul>
      <p>Agradecomendos su pronta respuesta.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0;" />
      <p style="color: #94a3b8; font-size: 12px;">
        Generado automáticamente por Findr.ai — Agente Digital de Compras
      </p>
    </div>
  `;
}

export async function emailVendor(
  params: EmailVendorParams,
): Promise<EmailResult> {
  const { vendorName, vendorEmail, projectName, materialList } = params;
  const resend = getResend();

  try {
    const { data, error } = await resend.emails.send({
      from: "Findr.ai <cotizaciones@findr.ai>",
      to: vendorEmail,
      subject: `Solicitud de Cotización — ${projectName}`,
      html: buildRfqHtml(projectName, materialList),
    });

    if (error) {
      return { success: false, error: error.message, vendorName };
    }

    return { success: true, emailId: data?.id, vendorName };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      vendorName,
    };
  }
}

export async function savePendingQuote(
  materialId: string,
  vendorName: string,
) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('vendor_quotes')
    .insert({
      vendor_name: vendorName,
      material_id: materialId,
      unit_price: 0,
      total_price: 0,
      source: "email",
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
