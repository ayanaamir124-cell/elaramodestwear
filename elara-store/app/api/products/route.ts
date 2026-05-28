import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { defaultProducts } from "@/lib/data";
export async function GET() {
  try {
    const { data, error } = await getServiceClient().from("products").select("*").order("created_at",{ascending:false});
    return NextResponse.json(!error && data?.length ? data : defaultProducts);
  } catch { return NextResponse.json(defaultProducts); }
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { data, error } = await getServiceClient().from("products").insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}
