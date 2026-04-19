import { LockIcon } from "./login-icons";

export const LoginHeader = () => {
  return (
    <header className="relative z-10 flex justify-between items-center px-8 py-10 w-full">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)",
            boxShadow: "0 0 20px rgba(129,236,255,0.3)",
          }}
        >
          <span style={{ color: "#003840" }}>
            <LockIcon />
          </span>
        </div>
        <span
          className="text-2xl font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f8f9fe" }}
        >
          Vault
        </span>
      </div>
    </header>
  );
};
