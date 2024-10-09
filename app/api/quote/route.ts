import { SEPOLIA_CHAIN_ID } from "@/lib/constants";
import { type NextRequest } from "next/server";
import { type ZeroExApiQuoteResponse } from "../../../types";

async function fetchQuoteData(
  searchParams: URLSearchParams,
  chainId: string
): Promise<ZeroExApiQuoteResponse> {
  const res = await fetch(
    `https://${
      Number(chainId) === SEPOLIA_CHAIN_ID ? "sepolia.api" : "api"
    }.0x.org/swap/v1/quote?${searchParams}`,
    {
      headers: {
        "0x-api-key": process.env.ZEROEX_API_KEY as string,
        "0x-chain-id": searchParams.get("chainId") as string,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch quote data from 0x API: ${res.statusText}`
    );
  }

  return await res.json();
}

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const chainId = searchParams.get("chainId");

  if (!chainId) {
    return Response.json(
      { error: "Missing required query parameter: chainId" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchQuoteData(searchParams, chainId);
    return Response.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data from 0x API:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    return Response.json(
      { error: "Error fetching data from 0x API" },
      { status: 500 }
    );
  }
}
