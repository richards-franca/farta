type IconName = 'basket' | 'grid' | 'drink' | 'box' | 'milk' | 'carrot' | 'bread' | 'cleaning' | 'cup' | 'snow' | 'check' | 'team' | 'support';
const paths: Record<IconName,string> = {
 basket:'m7 4-4 7h18l-4-7M3 11l2 9h14l2-9M9 14v3m6-3v3',
 grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
 drink:'M8 3h8l2 8a6 6 0 0 1-12 0l2-8ZM12 17v4m-4 0h8M7 10h10',
 box:'m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10M7 4l10 6',
 milk:'M9 2h6v5l3 4v10H6V11l3-4V2ZM9 5h6M6 13h12',
 carrot:'m3 21 5-13 8 8L3 21ZM14 8l4-5m-2 7 5-1m-9-3 1-5M7 12l3 3',
 bread:'M5 7c-4 0-4 7 0 7v6h14v-6c4 0 4-7 0-7-2-6-12-6-14 0ZM9 8v5m5-6v5',
 cleaning:'M10 7h7l2 14H8L10 7Zm1-4h6v4M9 3H6M3 7h1m0-4h1M11 13h6',
 cup:'M6 7h13l-2 14H8L6 7Zm-2 0h17M14 7l2-5',
 snow:'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3',
 check:'m8 12 3 3 5-6M12 2l3 2h4v4l3 4-3 4v4h-4l-3 2-3-2H5v-4l-3-4 3-4V4h4l3-2Z',
 team:'M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 3a4 4 0 0 1 0 8m4 10v-3a4 4 0 0 0-3-4',
 support:'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v8H3zM17 12h4v8h-4z',
};
export function CommerceIcon({name,className}:{name:IconName;className?:string}) {
 return <svg className={className} aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg>;
}
export function CategoryIcon({category}:{category:string}) {
 const key=category.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const name:IconName=key==='todos'?'grid':key.includes('bebida')?'drink':key.includes('latic')?'milk':key.includes('hort')?'carrot':key.includes('pad')?'bread':key.includes('limp')?'cleaning':key.includes('descart')?'cup':key.includes('congel')?'snow':'box';
 return <CommerceIcon name={name}/>;
}
