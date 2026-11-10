'use client';
import { startTransition, useActionState } from 'react';

/**
 * useActionState para formulários que não podem perder o que foi digitado.
 *
 * O React limpa o formulário ao fim de toda action passada em `<form action>`, mesmo quando
 * ela só devolve um erro de validação: campos não controlados esvaziam e um `<select>` volta
 * ao valor inicial mesmo sendo controlado. Enviando pelo `onSubmit` nada é limpo.
 *
 *   const [state, enviar, pending] = useEnvio(salvarAlgo);
 *   <form onSubmit={enviar}>…</form>
 */
export function useEnvio(action, estadoInicial = { erro: null }) {
  const [state, despachar, pending] = useActionState(action, estadoInicial);
  const enviar = (evento) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    startTransition(() => despachar(dados));
  };
  return [state, enviar, pending];
}
