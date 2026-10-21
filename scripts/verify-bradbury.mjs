/* global process, fetch, console */
const required=(name)=>{const value=process.env[name];if(!value)throw new Error(`Missing ${name}`);return value};
const chainRpc=required('BRADBURY_CHAIN_RPC_URL');
const icRpc=required('BRADBURY_IC_RPC_URL');
const expectedGenesis=required('BRADBURY_EXPECTED_GENESIS_HASH').toLowerCase();
async function rpc(url,method,params=[]){const response=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});if(!response.ok)throw new Error(`${method} HTTP ${response.status}`);return response.json()}
const chainId=await rpc(chainRpc,'eth_chainId');
if(chainId.result!=='0x107d')throw new Error(`Expected Bradbury chain 4221 (0x107d), got ${chainId.result??JSON.stringify(chainId.error)}`);
const genesis=await rpc(chainRpc,'eth_getBlockByNumber',['0x0',false]);
if(String(genesis.result?.hash||'').toLowerCase()!==expectedGenesis)throw new Error(`Genesis mismatch: got ${genesis.result?.hash||'none'}`);
const probe=await rpc(icRpc,'gen_getContractSchema',['0x0000000000000000000000000000000000000000']);
if(probe.error?.code===-32601)throw new Error('Configured IC endpoint does not expose gen_* methods; an eth-only Chain RPC cannot be used.');
console.log(JSON.stringify({chainId:4221,genesis:genesis.result.hash,icMethodAvailable:true},null,2));
