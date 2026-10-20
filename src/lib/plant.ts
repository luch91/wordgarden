export interface PlantTraits{stem:string;petal:string;accent:string;height:number;petals:number;lean:number;leaves:number}
const palettes=[['#356859','#ef735d','#f2b84b'],['#4b5aa8','#8e76c7','#f3a85c'],['#226b72','#2d66d5','#ef8a73'],['#607c38','#d8547d','#ffc45b']];
export function hashSeed(value:string){let h=2166136261;for(const c of value){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
export function plantTraits(id:string,language='',word=''):PlantTraits{const h=hashSeed(`${id}|${language}|${word.length}`);const p=palettes[h%palettes.length];return{stem:p[0],petal:p[1],accent:p[2],height:86+(h%42),petals:5+(h%4),lean:(h%17)-8,leaves:2+(h%3)}}
