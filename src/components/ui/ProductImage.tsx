'use client';
import Image from 'next/image';
import {useState} from 'react';
export function ProductImage({src,alt,width,height}:{src?:string|null;alt:string;width:number;height:number}){
 const [broken,setBroken]=useState<string[]>([]);
 const fallback='/product-placeholder.svg';
 const source=src&&!broken.includes(src)?src:fallback;
 return <Image src={source} alt={alt} width={width} height={height} onError={()=>{if(source!==fallback)setBroken(values=>[...values,source]);}}/>;
}
