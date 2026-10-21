import {describe,expect,it,vi} from 'vitest';
import {feeError,prepareFees} from '../../src/genlayer/fees';
describe('fee preparation',()=>{
 it('keeps gasless StudioNet writes unchanged',async()=>expect(await prepareFees({}, {request:vi.fn()},'0x1',{},61999)).toBeUndefined());
 it('checks the wallet balance against the quote',async()=>{const client={estimateTransactionFeesForWrite:vi.fn().mockResolvedValue({distribution:{},feeValue:10n})};await expect(prepareFees(client,{request:vi.fn().mockResolvedValue('0x09')},'0x1',{},4221)).rejects.toThrow('enough GEN')});
 it('explains stale fee quotes',()=>expect(feeError(new Error('MaxPriceExceeded')).message).toContain('no longer valid'));
});
