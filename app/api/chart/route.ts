import { DEFAULT_BUY_TOKEN } from "@/lib/utils";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const sellToken = searchParams.get("sellToken") || "";
    const buyToken = DEFAULT_BUY_TOKEN;
    const period = searchParams.get("period") || "";

    if (!sellToken || !buyToken || !period) {
      return Response.json(
        { error: "Missing required query parameters" },
        { status: 400 }
      );
    }

    const url = buildCoinGeckoUrl(sellToken, buyToken, period);
    const res = await fetch(url);

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch data from CoinGecko" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return Response.json(data.prices);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data from CoinGecko:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return Response.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}

function buildCoinGeckoUrl(
  sellToken: string,
  buyToken: string,
  period: string
): string {
  const url = new URL(
    `https://api.coingecko.com/api/v3/coins/${sellToken}/market_chart`
  );
  url.search = new URLSearchParams({
    vs_currency: buyToken,
    days: period,
  }).toString();
  return url.toString();
}
