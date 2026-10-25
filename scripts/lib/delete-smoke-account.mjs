// Only fixtures created by smoke-vps may be removed. Database FK restrictions stay enabled.
export async function deleteSmokeAccount(client,userId) {
 const identity=await client.auth.admin.getUserById(userId);
 if(identity.error)throw new Error('Unable to verify temporary account ownership');
 const user=identity.data.user;
 if(!user || !/^farta-vps-smoke-[0-9a-f-]+@example\.invalid$/.test(user.email??'') || user.user_metadata?.full_name!=='Validação técnica temporária')return false;
 const {data:profile,error}=await client.from('profiles').select('id,company_id,status').eq('id',userId).maybeSingle();
 if(error)throw new Error('Unable to verify temporary profile isolation');
 if(profile && (profile.company_id!==null||profile.status!=='PENDING'))return false;
 // profiles references auth.users with ON DELETE RESTRICT. Remove the unlinked fixture first.
 if(profile){
  const deletion=await client.from('profiles').delete().eq('id',userId).eq('status','PENDING').is('company_id',null).select('id');
  if(deletion.error)throw new Error('Temporary profile is referenced; refusing further deletion');
  if(deletion.data?.length!==1)return false;
 }
 const deletion=await client.auth.admin.deleteUser(userId);
 if(deletion.error)throw new Error('Temporary Auth account deletion failed');
 return true;
}
