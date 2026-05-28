import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
export async function POST(req:NextRequest) {
  const {password} = await req.json();
  if (password !== (process.env.ADMIN_PASSWORD||"elara2026"))
    return NextResponse.json({error:"Invalid password"},{status:401});
  const secret = new TextEncoder().encode(process.env.JWT_SECRET||"elara-secret-key");
  const token = await new SignJWT({role:"admin"}).setProtectedHeader({alg:"HS256"}).setExpirationTime("7d").sign(secret);
  const res = NextResponse.json({success:true});
  res.cookies.set("admin_token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:604800});
  return res;
}
