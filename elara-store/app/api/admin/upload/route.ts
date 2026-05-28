import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
export async function POST(req:NextRequest) {
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File;
    if (!file) return NextResponse.json({error:"No file"},{status:400});
    const buf = Buffer.from(await file.arrayBuffer());
    const name = `${Date.now()}-${file.name.replace(/\s/g,"-")}`;
    const sb = getServiceClient();
    const {error} = await sb.storage.from("elara-images").upload(name,buf,{contentType:file.type,upsert:true});
    if (error) throw error;
    const {data:{publicUrl}} = sb.storage.from("elara-images").getPublicUrl(name);
    return NextResponse.json({url:publicUrl});
  } catch (e:unknown) { return NextResponse.json({error:(e as Error).message},{status:500}); }
}
