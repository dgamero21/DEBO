import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Loader2,
  LockKeyhole,
  Chrome,
  Apple,
  AppWindow
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface LoginViewProps {
  initialMode: "login" | "register" | "forgot";
  onNavigate: (view: "landing" | "login" | "register" | "forgot" | "dashboard") => void;
  onLoginSuccess: () => void;
}

export default function LoginView({ initialMode, onNavigate, onLoginSuccess }: LoginViewProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  // UX enhancements
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Parse any OAuth error parameters in URL hash or search parameters
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    let errorDesc = "";

    if (hash.startsWith("#")) {
      const params = new URLSearchParams(hash.substring(1));
      if (params.get("error") || params.get("error_description")) {
        errorDesc = params.get("error_description") || params.get("error") || "";
      }
    }

    if (!errorDesc && search) {
      const params = new URLSearchParams(search);
      if (params.get("error") || params.get("error_description")) {
        errorDesc = params.get("error_description") || params.get("error") || "";
      }
    }

    if (errorDesc) {
      const decodedError = decodeURIComponent(errorDesc).replace(/\+/g, " ");
      const providerLabel = decodedError.toLowerCase().includes("google") 
        ? "Google" 
        : decodedError.toLowerCase().includes("azure") || decodedError.toLowerCase().includes("microsoft")
        ? "Microsoft"
        : "Apple";

      if (decodedError.toLowerCase().includes("not enabled") || decodedError.toLowerCase().includes("disabled") || decodedError.toLowerCase().includes("unsupported provider")) {
        setError(
          `El proveedor ${providerLabel} aún no está activado en tu panel de Supabase.\n\n` +
          `Para activarlo y configurarlo:\n` +
          `1. Ve a tu Supabase Dashboard -> Authentication -> Providers.\n` +
          `2. Haz clic en "${providerLabel}", actívalo y guarda los cambios.\n\n` +
          `¡O si lo prefieres, regístrate al instante ingresando tu Correo y Contraseña arriba!`
        );
      } else {
        setError(`Error de autenticación con ${providerLabel}: ${decodedError}`);
      }

      // Clean the URL hash and parameters so they don't persist on a manual refresh
      try {
        const cleanSearch = window.location.search.replace(/[?&]error(_description)?=[^&]*/g, "");
        const cleanUrl = window.location.pathname + (cleanSearch && cleanSearch !== "?" ? cleanSearch : "");
        window.history.replaceState(null, "", cleanUrl);
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      } catch (e) {
        console.warn("Could not clean up URL state:", e);
      }
    }
  }, []);

  const handleModeChange = (newMode: "login" | "register" | "forgot") => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!email || !password) {
          setError("Por favor completa tu correo electrónico y contraseña.");
          setIsLoading(false);
          return;
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          const msg = signInError.message || "";
          if (msg.toLowerCase().includes("confirm") || msg.toLowerCase().includes("not confirmed")) {
            setError(
              "El correo electrónico no ha sido confirmado aún.\n\n" +
              "Para resolverlo:\n" +
              "• Si usaste un correo real, revisa tu casilla de entrada para confirmar la cuenta.\n" +
              "• Si eres el administrador del proyecto: Ve a tu panel de Supabase -> Authentication -> Providers -> Email, desactiva la opción 'Confirm email' y guarda los cambios."
            );
          } else {
            setError(msg || "Error al iniciar sesión. Inténtalo de nuevo.");
          }
          setIsLoading(false);
          return;
        }

        setSuccessMsg("¡Inicio de sesión exitoso! Redirigiendo...");
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);

      } else if (mode === "register") {
        if (!name.trim() || !email.trim() || !password) {
          setError("Por favor completa todos los campos requeridos.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden. Por favor verifica.");
          setIsLoading(false);
          return;
        }

        if (!acceptTerms) {
          setError("Debes aceptar los términos y condiciones de uso para continuar.");
          setIsLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message || "Error al registrar la cuenta.");
          setIsLoading(false);
          return;
        }

        // Check if user is registered but requires email confirmation
        if (data?.user && !data?.session) {
          setSuccessMsg("¡Registro exitoso! Te hemos enviado un correo de confirmación. Por favor verifícalo para poder ingresar (puedes desactivar esta confirmación en la sección Authentication de tu panel de Supabase).");
          setIsLoading(false);
          return;
        }

        setSuccessMsg("¡Registro exitoso! Iniciando sesión automáticamente...");
        setTimeout(() => {
          onLoginSuccess();
        }, 1200);

      } else {
        // forgot password mode
        if (!email.trim()) {
          setError("Por favor ingresa tu dirección de correo electrónico.");
          setIsLoading(false);
          return;
        }

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());

        if (resetError) {
          setError(resetError.message || "No se pudo procesar la solicitud de recuperación.");
          setIsLoading(false);
          return;
        }

        setSuccessMsg("¡Perfecto! Si el correo existe en nuestro sistema, recibirás un enlace de restauración a la brevedad.");
        setEmail("");
      }
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error inesperado de red.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "azure" | "apple") => {
    setError("");
    setSuccessMsg("");
    setIsLoading(true);
    const providerLabel = provider === "azure" ? "Microsoft" : provider === "google" ? "Google" : "Apple";
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          ...(provider === "google" ? { queryParams: { prompt: "select_account" } } : {}),
        },
      });
      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.toLowerCase().includes("not enabled") || errMsg.toLowerCase().includes("disabled") || errMsg.toLowerCase().includes("unsupported provider")) {
        setError(
          `El proveedor ${providerLabel} aún no está activado en tu panel de Supabase.\n\n` +
          `Para activarlo y configurarlo:\n` +
          `1. Ve a tu Supabase Dashboard -> Authentication -> Providers.\n` +
          `2. Haz clic en "${providerLabel}", actívalo y guarda los cambios.\n\n` +
          `¡O si lo prefieres, regístrate al instante ingresando tu Correo y Contraseña arriba!`
        );
      } else {
        setError(`Error al iniciar sesión con ${providerLabel}: ` + errMsg);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between py-6 px-4 sm:py-8 sm:px-6 relative overflow-hidden font-sans selection:bg-accent-soft selection:text-accent-dark">
      
      {/* Glow Ambient Blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent-light/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-accent-soft/35 blur-3xl" />

      {/* Header Area */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center z-10">
        <button 
          id="btn-back-home"
          onClick={() => onNavigate("landing")}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-dark font-semibold transition-all duration-200"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-dark flex items-center justify-center text-white font-bold text-sm">
            D
          </div>
          <span className="font-bold text-text-primary tracking-tight">DEBO</span>
        </div>
      </header>

      {/* Auth Card Layout Container */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-12 z-10 w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl sm:rounded-[32px] border border-border-primary bg-bg-secondary p-5 sm:p-8 md:p-10 shadow-xl relative"
        >
          {/* Header text based on current mode */}
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              {mode === "login" && "Iniciar Sesión"}
              {mode === "register" && "Crear Cuenta"}
              {mode === "forgot" && "Recuperar Contraseña"}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              {mode === "login" && "Ingresa tus credenciales para administrar tus cuentas bancarias."}
              {mode === "register" && "Únete hoy y automatiza tu análisis financiero en minutos."}
              {mode === "forgot" && "Te enviaremos un email seguro para restaurar tu contraseña."}
            </p>
          </div>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-2xl bg-error-bg border border-error-main/10 text-error-main text-xs font-semibold flex items-start gap-2.5 overflow-hidden"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-2xl bg-success-bg border border-success-main/10 text-success-main text-xs font-semibold flex items-start gap-2.5 overflow-hidden"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form id="form-auth" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name input (Register Mode Only) */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escribe tu nombre" 
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border-primary bg-bg-primary outline-none text-sm transition-all duration-200 focus:border-accent focus:bg-white disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email input (All Modes) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input 
                  type="email" 
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com" 
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border-primary bg-bg-primary outline-none text-sm transition-all duration-200 focus:border-accent focus:bg-white disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password input (Login and Register Modes Only) */}
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                    Contraseña
                  </label>
                  {mode === "login" && (
                    <button 
                      type="button"
                      id="btn-forgot-password-link"
                      onClick={() => handleModeChange("forgot")}
                      className="text-xs font-bold text-accent hover:text-accent-dark transition-colors"
                      disabled={isLoading}
                    >
                      ¿La olvidaste?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "register" ? "Mínimo 6 caracteres" : "••••••••"} 
                    className="w-full h-12 pl-11 pr-11 rounded-2xl border border-border-primary bg-bg-primary outline-none text-sm transition-all duration-200 focus:border-accent focus:bg-white disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary focus:outline-none"
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password input (Register Mode Only) */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña" 
                    className="w-full h-12 pl-11 pr-11 rounded-2xl border border-border-primary bg-bg-primary outline-none text-sm transition-all duration-200 focus:border-accent focus:bg-white disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Terms and Conditions Acceptance (Register Mode Only) */}
            {mode === "register" && (
              <div className="flex items-start gap-2 text-xs py-1">
                <input 
                  type="checkbox" 
                  id="chk-terms"
                  checked={acceptTerms}
                  disabled={isLoading}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-accent-dark rounded border-border-primary cursor-pointer disabled:opacity-50"
                />
                <label htmlFor="chk-terms" className="text-text-secondary select-none cursor-pointer">
                  Acepto los <span className="font-bold text-accent hover:underline">Términos de Servicio</span> y la <span className="font-bold text-accent hover:underline">Política de Privacidad</span>.
                </label>
              </div>
            )}

            {/* Form Submit Button with Loading Spinner */}
            <button 
              type="submit"
              id="btn-submit-form"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-accent-dark text-white font-bold text-sm shadow-md hover:bg-accent hover:shadow-lg disabled:bg-text-disabled disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  {mode === "login" && "Ingresar"}
                  {mode === "register" && "Registrarse"}
                  {mode === "forgot" && "Enviar Instrucciones"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Register / Login Options */}
          {mode !== "forgot" && (
            <div className="space-y-3 pt-6 mt-6 border-t border-border-secondary">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border-primary"></div>
                <span className="flex-shrink mx-3 text-text-tertiary text-[10px] font-bold uppercase tracking-wider">O continuar con</span>
                <div className="flex-grow border-t border-border-primary"></div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  id="btn-oauth-google"
                  disabled={isLoading}
                  onClick={() => handleOAuthSignIn("google")}
                  className="w-full h-11 px-4 rounded-2xl border border-border-primary bg-bg-primary hover:border-accent hover:bg-white disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2.5 text-xs font-bold text-text-primary"
                >
                  <Chrome className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Registrarse / Ingresar con Gmail</span>
                </button>

                <button
                  type="button"
                  id="btn-oauth-microsoft"
                  disabled={isLoading}
                  onClick={() => handleOAuthSignIn("azure")}
                  className="w-full h-11 px-4 rounded-2xl border border-border-primary bg-bg-primary hover:border-accent hover:bg-white disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2.5 text-xs font-bold text-text-primary"
                >
                  <AppWindow className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Registrarse / Ingresar con Microsoft</span>
                </button>

                <button
                  type="button"
                  id="btn-oauth-apple"
                  disabled={isLoading}
                  onClick={() => handleOAuthSignIn("apple")}
                  className="w-full h-11 px-4 rounded-2xl border border-border-primary bg-bg-primary hover:border-accent hover:bg-white disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2.5 text-xs font-bold text-text-primary"
                >
                  <Apple className="w-4 h-4 text-text-primary shrink-0" />
                  <span>Registrarse / Ingresar con Apple</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode Switch Footer Links */}
          <div className="mt-8 pt-4 border-t border-border-secondary text-center text-xs text-text-secondary">
            {mode === "login" && (
              <>
                ¿No tienes una cuenta?{" "}
                <button 
                  type="button" 
                  onClick={() => handleModeChange("register")}
                  className="font-bold text-accent hover:text-accent-dark transition-colors hover:underline"
                  disabled={isLoading}
                >
                  Regístrate gratis
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                ¿Ya tienes una cuenta?{" "}
                <button 
                  type="button" 
                  onClick={() => handleModeChange("login")}
                  className="font-bold text-accent hover:text-accent-dark transition-colors hover:underline"
                  disabled={isLoading}
                >
                  Inicia sesión
                </button>
              </>
            )}
            {mode === "forgot" && (
              <button 
                type="button" 
                onClick={() => handleModeChange("login")}
                className="font-bold text-accent hover:text-accent-dark transition-colors hover:underline inline-flex items-center gap-1"
                disabled={isLoading}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio de Sesión
              </button>
            )}
          </div>

        </motion.div>
      </div>

      {/* Footer Area */}
      <footer className="max-w-7xl mx-auto w-full text-center text-[11px] text-text-tertiary z-10 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-border-secondary/50 pt-4">
        <div>
          DEBO Finanzas • Seguridad con cifrado de grado bancario.
        </div>
        <div>
          Powered by Supabase Authentication
        </div>
      </footer>
    </div>
  );
}
