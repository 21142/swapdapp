import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;

   try {
      const res = await fetch(
         `https://api.0x.org/tx-relay/v1/swap/price?${searchParams}`,
         {
            headers: {
               "0x-api-key": process.env.NEXT_PUBLIC_ZEROEX_API_KEY as string,
               "0x-chain-id": searchParams.get("chainId") as string,
            },
         }
      );
      const data = await res.json();

      return Response.json(data);
   } catch (error) {
      console.log(error);
      return Response.json({ error: 'Error fetching data from CoinGecko' }, { status: 500 });
   }
}
