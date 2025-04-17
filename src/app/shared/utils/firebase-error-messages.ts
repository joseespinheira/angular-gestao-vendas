/**
 * Função para mapear mensagens de erro do Firebase para mensagens amigáveis.
 * @param firebaseMessage Mensagem de erro retornada pelo Firebase.
 * @returns Mensagem amigável para o usuário.
 */
export function getFriendlyFirebaseErrorMessage(
  firebaseMessage: string
): string {
  const errorMap: { [key: string]: string } = {
    'auth/user-not-found': 'Usuário não encontrado. Verifique seu e-mail.',
    'auth/wrong-password': 'Senha incorreta. Verifique sua senha.',
    'auth/invalid-email': 'E-mail inválido. Verifique seu e-mail.',
    'auth/too-many-requests':
      'Muitas tentativas de login. Tente novamente mais tarde.',
    'auth/operation-not-allowed':
      'Operação não permitida. Verifique a configuração do Firebase.',
    'auth/weak-password':
      'Senha fraca. A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-api-key':
      'Chave de API inválida. Verifique a configuração do Firebase.',
    'auth/invalid-credential':
      'Credencial inválida. Verifique seu usuario e senha.',
    'auth/invalid-verification-code':
      'Código de verificação inválido. Verifique seu e-mail.',
    'auth/invalid-verification-id':
      'ID de verificação inválido. Verifique seu e-mail.',
    'auth/expired-action-code':
      'Código de ação expirado. Solicite um novo código.',
    'auth/invalid-action-code':
      'Código de ação inválido. Solicite um novo código.',
    'auth/user-disabled': 'Usuário desativado. Entre em contato com o suporte.',
    'auth/operation-not-supported-in-this-environment':
      'Operação não suportada neste ambiente.',
    'auth/invalid-continue-uri':
      'URL de continuação inválida. Verifique a configuração do Firebase.',
    'auth/unauthorized-domain':
      'Domínio não autorizado. Verifique a configuração do Firebase.',
    'auth/invalid-dynamic-link-domain':
      'Domínio de link dinâmico inválido. Verifique a configuração do Firebase.',
    'auth/invalid-email-verified':
      'E-mail não verificado. Verifique seu e-mail.',
  };

  // Extrai o código do erro do Firebase
  const errorCode = firebaseMessage.match(/\(auth\/(.+?)\)/)?.[1];

  // Retorna a mensagem amigável ou uma mensagem padrão
  return errorCode && errorMap['auth/' + errorCode]
    ? errorMap['auth/' + errorCode]
    : 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
}
