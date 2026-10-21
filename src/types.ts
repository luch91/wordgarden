export type AssessmentStatus='ACCEPTED'|'REJECTED'|'INCONCLUSIVE';
export type DocumentationLevel='LIMITED'|'SUPPORTED'|'STRONG';
export interface WordEntry {id:string;contributor:string;word:string;language_name:string;language_code_optional?:string;pronunciation?:string;definition:string;usage_example:string;cultural_context:string;usage_category:string;region_optional?:string;evidence_urls:string[];created_at:string;assessment_status:AssessmentStatus;assessment_reason:string;documentation_level:DocumentationLevel;assessment_version:string}
export interface EntryPage {entries:WordEntry[];next_cursor:number;has_more:boolean}
export interface Submission {word:string;language_name:string;language_code_optional:string;pronunciation:string;definition:string;usage_example:string;cultural_context:string;usage_category:string;region_optional:string;evidence_urls:string[]}
export type TxPhase='idle'|'confirming'|'submitted'|'consensus'|'finalized'|'failed';
