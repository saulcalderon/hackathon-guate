'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { getBrowserSupabaseClient } from '@/lib/supabase/client';

type AuthModalProps = {
  isOpen: boolean;
  isConfigured: boolean;
  onClose: () => void;
  redirectPath?: string;
};

export default function AuthModal({
  isOpen,
  isConfigured,
  onClose,
  redirectPath = '/dashboard',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (isConfigured) {
      setInfoMessage('Te enviaremos un enlace mágico para entrar a tu cuenta.');
    } else {
      setInfoMessage(
        'Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY para activar el login.'
      );
    }
  }, [isConfigured]);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isConfigured) {
      setErrorMessage('Falta configurar Supabase en las variables de entorno.');
      return;
    }

    setIsSubmitting(true);

    const supabase = getBrowserSupabaseClient();
    const redirectTo =
      typeof window === 'undefined'
        ? undefined
        : new URL(redirectPath, window.location.origin).toString();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: mode === 'signup',
      },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setInfoMessage(
      mode === 'signup'
        ? 'Revisa tu correo para confirmar el registro e ingresar.'
        : 'Revisa tu correo para abrir tu enlace de acceso.'
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="relative w-full max-w-[500px] rounded-[18px] bg-[#f7f7f7] shadow-[0_24px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-black/10 bg-[#ececec] text-[30px] leading-none text-[#7a7a7a] transition hover:bg-[#e3e3e3]"
          aria-label="Cerrar login"
        >
          ×
        </button>

        <div className="px-6 pb-6 pt-10 sm:px-12 sm:pb-8">
          <div className="text-center">
            <h2 className="text-[42px] font-semibold leading-none text-[#262626]">
              {mode === 'login' ? 'Entrar' : 'Regístrate'}
            </h2>
            <p className="mt-4 text-[18px] text-[#7b7b7b]">Bienvenido a Findr.ai</p>
          </div>

          <form className="mt-10" onSubmit={handleSubmit}>
            <label className="block text-left">
              <span className="mb-3 block text-[17px] font-semibold text-[#353535]">
                Correo electrónico
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ingrese su dirección de correo electrónico"
                className="h-14 w-full rounded-xl border border-[#d8d8d8] bg-[#fbfbfb] px-4 text-[16px] text-[#2f2f2f] outline-none transition placeholder:text-[#8c8c8c] focus:border-findrai-primary focus:ring-4 focus:ring-findrai-light/20"
                autoComplete="email"
                required
              />
            </label>

            {errorMessage ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {infoMessage ? (
              <div className="mt-4 rounded-xl border border-findrai-light/30 bg-findrai-light/15 px-4 py-3 text-left text-sm text-findrai-primary">
                {infoMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || !isConfigured}
              className="mt-10 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#4a4d57] to-[#2e313c] text-[18px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Enviando...' : 'Continuar'}</span>
              <span className="text-[13px] opacity-90">▶</span>
            </button>
          </form>
        </div>

        <div className="rounded-b-[18px] border-t border-black/10 bg-[#f2f2f2] px-6 py-5 text-center sm:px-12">
          <p className="text-[16px] text-[#6f6f6f]">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                const nextMode = mode === 'login' ? 'signup' : 'login';
                setMode(nextMode);
                setErrorMessage('');
                setInfoMessage(
                  nextMode === 'signup'
                    ? 'Te enviaremos un enlace para crear tu acceso.'
                    : isConfigured
                      ? 'Te enviaremos un enlace mágico para entrar a tu cuenta.'
                      : 'Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY para activar el login.'
                );
              }}
              className="font-semibold text-findrai-primary transition hover:text-findrai-secondary"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
