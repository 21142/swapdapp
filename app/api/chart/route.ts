export async function GET(request: Request) {
   try {
      const { searchParams } = new URL(request.url);
      const sellToken = searchParams.get('sellToken');
      const buyToken = searchParams.get('buyToken');
      const period = searchParams.get('period');

      if (!sellToken || !buyToken || !period) {
         return Response.json(
            { error: 'Missing required query parameters' },
            { status: 400 }
         );
      }

      const url = new URL(
         `https://api.coingecko.com/api/v3/coins/${sellToken}/market_chart`
      );
      const params = {
         vs_currency: buyToken,
         days: period,
      };
      url.search = new URLSearchParams(params).toString();
      const res = await fetch(url.toString());

      if (!res.ok) {
         return Response.json(
            { error: 'Failed to fetch data from CoinGecko' },
            { status: res.status }
         );
      }

      const data = await res.json();

      return Response.json(data.prices);
   } catch (error) {
      console.error('Error fetching data from CoinGecko:', error);
      return Response.json(
         { error: 'An error occurred while fetching data' },
         { status: 500 }
      );
   }
}
