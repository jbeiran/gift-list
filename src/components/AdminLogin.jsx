import { useState } from "react";
import { motion } from "framer-motion";

const AdminLogin = ({ listId, listData, onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verificar que el email y código coincidan con los de la lista
    if (
      email.toLowerCase().trim() === listData.ownerEmail.toLowerCase().trim() &&
      code.trim() === listData.accessCode.trim()
    ) {
      // Autenticación exitosa
      // Guardar en sessionStorage para mantener la sesión
      sessionStorage.setItem(
        `auth_${listId}`,
        JSON.stringify({
          email,
          timestamp: Date.now(),
        })
      );
      onAuthenticated();
    } else {
      setError("Email o código de acceso incorrecto");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-christmas-red mb-2">
            🔒 Panel de Administración
          </h1>
          <p className="text-gray-600">
            Ingresa tu email y código de acceso para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email del propietario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de acceso
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              placeholder="abc12345"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-christmas-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Acceder al panel 🎄"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-christmas-red transition"
          >
            ← Volver al inicio
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
