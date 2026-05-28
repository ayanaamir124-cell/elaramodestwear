import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
export async function GET() {
  try {
    const {data,error} = await getServiceClient().from("orders").select("*").order("created_at",{ascending:false});
    return NextResponse.json(!error ? data||[] : []);
  } catch { return NextResponse.json([]); }
}
export async function POST(req:NextRequest) {
  const body = await req.json();
  try {
    const {data,error} = await getServiceClient().from("orders").insert([{...body,status:"pending"}]).select().single();
    if (error) throw error; return NextResponse.json(data,{status:201});
  } catch (e:unknown) { return NextResponse.json({error:(e as Error).message},{status:500}); }
}
