const systemReasons:Record<string,string>={
 'Order submitted for price review':'Pedido enviado para análise de preços.',
 'Final prices defined':'Preços finais definidos pela equipe.',
 'Customer confirmed final price':'Preços finais confirmados pelo cliente.',
 'Order confirmed':'Pedido confirmado.',
};
export function orderReasonLabel(reason:string|null|undefined){return reason?(systemReasons[reason]??reason):'';}
