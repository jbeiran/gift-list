import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

const RequestForm = ({ gift, listId, listData, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedGifts = listData.gifts.map((g) =>
        g.id === gift.id ? { ...g, status: "pending", requestedBy: name } : g
      );

      await updateDoc(doc(db, "lists", listId), { gifts: updatedGifts });
      onSuccess();
    } catch (error) {
      console.error("Error requesting gift:", error);
      alert("Error al solicitar el regalo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-christmas-red mb-4">
          🎁 Solicitar regalo
        </h2>
        <p className="text-gray-600 mb-6">
          Estás solicitando: <span className="font-semibold">{gift.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              placeholder="Escribe tu nombre"
              required
            />
          </div>

          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Tu solicitud quedará pendiente hasta que {listData.ownerName}{" "}
              la apruebe.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-christmas-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Confirmar 🎁"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RequestForm;
