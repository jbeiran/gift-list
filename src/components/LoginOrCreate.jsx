import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const LoginOrCreate = () => {
  const [mode, setMode] = useState("create"); // 'create' or 'login'
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newList = {
        ownerName,
        ownerEmail,
        listName,
        listDescription,
        accessCode: uuidv4().slice(0, 8),
        gifts: [],
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "lists"), newList);
      
      // Guardar sesión antes de redirigir
      sessionStorage.setItem(
        `auth_${docRef.id}`,
        JSON.stringify({
          email: ownerEmail,
          timestamp: Date.now(),
        })
      );

      navigate(`/admin/${docRef.id}`);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Error al crear la lista");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(
        collection(db, "lists"),
        where("ownerEmail", "==", ownerEmail),
        where("accessCode", "==", accessCode)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const listId = querySnapshot.docs[0].id;
        
        // Guardar sesión antes de redirigir
        sessionStorage.setItem(
          `auth_${listId}`,
          JSON.stringify({
            email: ownerEmail,
            timestamp: Date.now(),
          })
        );

        navigate(`/admin/${listId}`);
      } else {
        alert("Email o código de acceso incorrecto");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
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
            🎄 Lista de Regalos 🎁
          </h1>
          <p className="text-gray-600">
            Crea y comparte tu lista de deseos navideños
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === "create"
                ? "bg-christmas-red text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Crear Lista
          </button>
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              mode === "login"
                ? "bg-christmas-green text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Acceder
          </button>
        </div>

        {mode === "create" ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu nombre
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu email
              </label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de tu lista
              </label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Ej: Regalos de Ana 🎄"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción de tu lista (opcional)
              </label>
              <textarea
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="Ej: Ideas de regalos para esta Navidad 🎅"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-christmas-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear mi lista 🎁"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu email
              </label>
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de acceso
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-christmas-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Accediendo..." : "Acceder a mi lista 🎄"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default LoginOrCreate;
