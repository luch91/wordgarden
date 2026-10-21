import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {ExecutionResult,TransactionStatus} from 'genlayer-js/types';
import type {EntryPage,Submission,WordEntry} from '../types';
import {isConfigured,network} from './config';
import {feeError,prepareFees} from './fees';

type Provider={request(args:{method:string;params?:unknown[]}):Promise<unknown>};
declare global {interface Window {ethereum?:Provider}}
const readClient=createClient({chain:studionet,endpoint:network.rpc});
const requireContract=()=>{if(!isConfigured) throw new Error('The production contract address has not been configured.');return network.contract};
const parse=<T>(value:unknown):T=>typeof value==='string'?JSON.parse(value) as T:value as T;

export async function listEntries(cursor=0,limit=25,acceptedOnly=true):Promise<EntryPage>{
 const value=await readClient.readContract({address:requireContract(),functionName:'list_entries',args:[cursor,limit,acceptedOnly]});
 return parse<EntryPage>(value);
}
export async function getEntry(id:string):Promise<WordEntry|null>{const value=await readClient.readContract({address:requireContract(),functionName:'get_entry',args:[id]});return value?parse<WordEntry>(value):null}
export async function listMine(address:string,cursor=0,limit=25):Promise<EntryPage>{const value=await readClient.readContract({address:requireContract(),functionName:'get_entries_by_submitter',args:[address,cursor,limit]});return parse<EntryPage>(value)}
export async function connectWallet():Promise<string>{if(!window.ethereum)throw new Error('No compatible browser wallet was found.');const accounts=await window.ethereum.request({method:'eth_requestAccounts'}) as string[];if(!accounts?.[0])throw new Error('Wallet connection was declined.');return accounts[0]}
export async function submitEntry(payload:Submission,onHash:(hash:string)=>void):Promise<{hash:string;entryId?:string}>{
 if(!window.ethereum)throw new Error('No compatible browser wallet was found.'); const accounts=await window.ethereum.request({method:'eth_requestAccounts'}) as string[];const account=accounts[0] as `0x${string}`;
 const client=createClient({chain:studionet,endpoint:network.rpc,account,provider:window.ethereum});await client.connect('studionet');
 const call={address:requireContract(),functionName:'submit_entry',args:[`json:${JSON.stringify(payload)}`],value:0n};
 try{const fees=await prepareFees(client as unknown as Parameters<typeof prepareFees>[0],window.ethereum,account,call,network.chainId);
 const hash=await client.writeContract({...call,...(fees?{fees}:{})} as Parameters<typeof client.writeContract>[0]);onHash(hash);
 const tx=await client.waitForTransactionReceipt({hash,status:TransactionStatus.FINALIZED});
 if(tx.txExecutionResultName!==ExecutionResult.FINISHED_WITH_RETURN)throw new Error(`Transaction finalized without a successful contract execution (${tx.txExecutionResultName}).`);
 const possible=(tx as unknown as {result?:unknown;returnData?:unknown}).result??(tx as unknown as {returnData?:unknown}).returnData;
 return {hash,entryId:typeof possible==='string'?possible:undefined};}catch(error){throw feeError(error)}
}
