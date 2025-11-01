import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const GiftForm = ({ listId, listData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newGift = {
        id: uuidv4(),
        ...formData,
        price: parseFloat(formData.price) || 0,
        status: "available",
        requestedBy: null,
        approvedByOwner: null,
      };

      const updatedGifts = [...listData.gifts, newGift];
      await updateDoc(doc(db, "lists", listId), { gifts: updatedGifts });

      onSuccess();
    } catch (error) {
      console.error("Error adding gift:", error);
      alert("Error al añadir el regalo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold text-christmas-green mb-4">
        ➕ Añadir nuevo regalo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del regalo *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enlace (URL)
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de imagen
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-green focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-christmas-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Añadiendo..." : "🎁 Añadir regalo"}
        </button>
      </form>
    </motion.div>
  );
};

export default GiftForm;
