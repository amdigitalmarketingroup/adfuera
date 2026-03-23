import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"

const leadSchema = z.object({
  screen_id: z.string().uuid(),
  media_owner_id: z.string().uuid(),
  advertiser_name: z.string().min(2, "Nombre requerido"),
  advertiser_company: z.string().optional(),
  advertiser_phone: z.string().min(10, "Teléfono requerido"),
  advertiser_email: z.string().email("Email inválido"),
  message: z.string().optional(),
  desired_start_date: z.string().optional(),
  desired_end_date: z.string().optional(),
  estimated_budget: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("leads")
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      console.error("Lead creation error:", error)
      return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 })
    }

    return NextResponse.json({ success: true, lead: data })
  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
