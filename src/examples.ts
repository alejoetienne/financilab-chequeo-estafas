export type ExampleId = 'estafa' | 'seguro' | 'paypal'

export const EXAMPLES: Record<
  ExampleId,
  { label: string; text: string; testId: string }
> = {
  estafa: {
    label: 'Estafa Banpro',
    testId: 'chip-estafa',
    text: 'Banpro: su cuenta será bloqueada en 24 horas por actividad inusual. Confirme su PIN en https://banpr0.top/verificar para evitar el bloqueo.',
  },
  seguro: {
    label: 'Recordatorio seguro',
    testId: 'chip-seguro',
    text: 'Banpro: recordatorio. Su pago de tarjeta vence el 25 de este mes. Puede pagar en la app oficial Banpro o en sucursal. Nunca le pediremos su PIN por mensaje.',
  },
  paypal: {
    label: 'PayPal falso',
    testId: 'chip-paypal',
    text: 'PayPal: detectamos actividad inusual en su cuenta. Verifique su identidad ahora en https://paypa1-secure.xyz/login o su cuenta será limitada.',
  },
}
