import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { defaultSettings } from "@/lib/data";
export async function GET() {
  try {
    const {data,error} = await getServiceClient().from("settings").select("*");
    if (error||!data?.length) return NextResponse.json(defaultSettings);
    const s = data.reduce((acc:Record<string,unknown>,r:{key:string,value:unknown})=>{acc[r.key]=r.value;return acc;},{});
    return NextResponse.json({...defaultSettings,...s});
  } catch { return NextResponse.json(defaultSettings); }
}
export async function POST(req:NextRequest) {
  const body = await req.json();
  try {
    const upserts = Object.entries(body).map(([key,value])=>({key,value,updated_at:new Date().toISOString()}));
    const {error} = await getServiceClient().from("settings").upsert(upserts,{onConflict:"key"});
    if (error) throw error; return NextResponse.json({success:true});
  } catch (e:unknown) { return NextResponse.json({error:(e as Error).message},{status:500}); }
}
