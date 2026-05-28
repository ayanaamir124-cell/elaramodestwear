import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { defaultProducts } from "@/lib/data";
type P = { params: Promise<{id:string}> };
export async function GET(_:NextRequest, {params}:P) {
  const {id} = await params;
  try {
    const {data,error} = await getServiceClient().from("products").select("*").eq("id",id).single();
    if (error||!data) { const fb=defaultProducts.find(p=>p.id===id); return fb?NextResponse.json(fb):NextResponse.json({error:"Not found"},{status:404}); }
    return NextResponse.json(data);
  } catch { const fb=defaultProducts.find(p=>p.id===id); return fb?NextResponse.json(fb):NextResponse.json({error:"Not found"},{status:404}); }
}
export async function PUT(req:NextRequest, {params}:P) {
  const {id} = await params; const body = await req.json();
  try {
    const {data,error} = await getServiceClient().from("products").update({...body,updated_at:new Date().toISOString()}).eq("id",id).select().single();
    if (error) throw error; return NextResponse.json(data);
  } catch (e: unknown) { return NextResponse.json({error:(e as Error).message},{status:500}); }
}
export async function DELETE(_:NextRequest, {params}:P) {
  const {id} = await params;
  try {
    const {error} = await getServiceClient().from("products").delete().eq("id",id);
    if (error) throw error; return NextResponse.json({success:true});
  } catch (e: unknown) { return NextResponse.json({error:(e as Error).message},{status:500}); }
}
