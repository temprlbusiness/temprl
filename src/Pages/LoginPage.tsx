import { LoginForm } from "@/components/ui/LoginForm";
import logo from "@/assets/logo.png";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function LoginPage() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:pt-4 overflow-hidden"
        style={{ backgroundColor: "#080c14" }}
      >
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex-1 flex flex-col justify-start items-center text-center w-full max-w-3xl mx-auto px-4 pt-3">
            {/* Logo */}
            <div className="mb-6">
              <img src={logo} alt="Logo" className="mx-auto w-32 h-auto" />
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </ThemeProvider>
  );
}
