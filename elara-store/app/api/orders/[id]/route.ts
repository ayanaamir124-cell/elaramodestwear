import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
type P = { params: Promise<{id:string}> };
export async function PATCH(req:NextRequest, {params}:P) {
  const {id} = await params; const body = await req.json();
  try {
    const {data,error} = await getServiceClient().from("orders").update(body).eq("id",id).select().single();
    if (error) throw error; return NextResponse.json(data);
  } catch (e:unknown) { return NextResponse.json({error:(e as Error).message},{status:500}); }
}
