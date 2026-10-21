type Provider = {request(input: {method: string; params?: unknown[]}): Promise<unknown>};
export type FeeQuote = {distribution: unknown; feeValue: bigint};
type FeeCapableClient = {estimateTransactionFeesForWrite?: (call: Record<string, unknown>) => Promise<{distribution: unknown; feeValue: bigint | string | number}>};

export function feeError(error: unknown): Error {
 const message=error instanceof Error?error.message:String(error);
 if(/insufficient|balance|funds/i.test(message))return new Error('Your wallet does not have enough GEN for the quoted transaction fee. Fund it, then request a fresh quote.');
 if(/fee|price|ceiling|expired|maxprice/i.test(message))return new Error('The network fee quote is no longer valid. Retry to obtain current fee limits.');
 if(/reject|denied|cancel/i.test(message))return new Error('The wallet signature was cancelled. No transaction was submitted.');
 return error instanceof Error?error:new Error(message);
}

export async function prepareFees(client:FeeCapableClient,provider:Provider,account:string,call:Record<string,unknown>,activeChainId:number):Promise<FeeQuote|undefined>{
 if(activeChainId===61999)return undefined;
 if(!client.estimateTransactionFeesForWrite)throw new Error('This fee-charging network requires the GenLayerJS v2 fee API. Production remains pinned to StudioNet until migration compatibility tests pass.');
 const estimated=await client.estimateTransactionFeesForWrite(call);const feeValue=BigInt(estimated.feeValue);
 const rawBalance=await provider.request({method:'eth_getBalance',params:[account,'latest']});
 if(typeof rawBalance!=='string')throw new Error('The wallet did not return a readable GEN balance.');
 if(BigInt(rawBalance)<feeValue)throw new Error('Your wallet does not have enough GEN for the quoted transaction fee.');
 return {distribution:estimated.distribution,feeValue};
}
