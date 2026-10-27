import { exchangeConfig } from "../../_connect/lib/server/exchange-gate";
import { createReciprocalHandler } from "../../_connect/lib/server/reciprocal-handler";
export const runtime="nodejs";
const receive=createReciprocalHandler(exchangeConfig());
export async function POST(request:Request) { return receive(request); }
