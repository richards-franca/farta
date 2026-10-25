export function prepareDumpScript(script,poolerUrl,projectRef) {
 if(!/^[a-z]{20}$/.test(projectRef))throw new Error('Invalid project reference');
 const pooler=new URL(poolerUrl);
 if(!/^[a-z0-9.-]+\.pooler\.supabase\.com$/.test(pooler.hostname))throw new Error('Expected a Supabase session pooler');
 let text=script.replace(/\x1b\[[0-9;]*m/g,'').replace(/\r/g,'');
 const role=text.match(/^(?:export )?PGUSER=(?:'([^']*)'|"([^"]*)"|([^\s]+))/m);
 if(!role||!/^export PGHOST=/m.test(text)||!/^export PGPORT=/m.test(text))throw new Error('Unsupported dump connection syntax');
 const value=role[1]??role[2]??role[3];
 const suffix='.'+projectRef;
 const baseRole=value.endsWith(suffix)?value.slice(0,-suffix.length):value;
 if(!/^[a-zA-Z0-9_]+$/.test(baseRole))throw new Error('Invalid dump role');
 text=text.replace(/^export PGHOST=.*$/m,`export PGHOST='${pooler.hostname}'`)
  .replace(/^(?:export )?PGUSER=.*$/m,`export PGUSER='${baseRole}.${projectRef}'`)
  .replace(/^export PGPORT=.*$/m,"export PGPORT='5432'");
 return text;
}
