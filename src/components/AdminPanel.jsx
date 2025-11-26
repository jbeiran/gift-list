import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import GiftForm from "./GiftForm";
import GiftCard from "./GiftCard";
import ShareLink from "./ShareLink";
import AdminLogin from "./AdminLogin";

const AdminPanel = () => {
  const { listId } = useParams();
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadList();
    checkAuthentication();
  }, [listId]);

  const checkAuthentication = () => {
    // Verificar si existe una sesión válida
    const authData = sessionStorage.getItem(`auth_${listId}`);
    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        // Sesión válida por 24 horas
        const isValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        setIsAuthenticated(isValid);
        if (!isValid) {
          sessionStorage.removeItem(`auth_${listId}`);
        }
      } catch (error) {
        sessionStorage.removeItem(`auth_${listId}`);
        setIsAuthenticated(false);
      }
    }
  };

  const loadList = async () => {
    try {
      const docRef = doc(db, "lists", listId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListData({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Error loading list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGift = async (giftId) => {
    try {
      const updatedGifts = listData.gifts.filter((gift) => gift.id !== giftId);
      await updateDoc(doc(db, "lists", listId), { gifts: updatedGifts });
      setListData({ ...listData, gifts: updatedGifts });
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGift(null);
    loadList();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGift(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`auth_${listId}`);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Cargando... ❄️</div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Lista no encontrada 😢</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        listId={listId}
        listData={listData}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-christmas-red mb-2">
                🎄 {listData.listName}
              </h1>
              <p className="text-gray-600 mb-4">
                Panel de administración de {listData.ownerName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
            >
              🔒 Cerrar sesión
            </button>
          </div>

          <div className="bg-christmas-gold/20 p-3 rounded-lg mb-4">
            <p className="text-sm font-semibold">
              🔑 Código de acceso:{" "}
              <span className="font-mono">{listData.accessCode}</span>
            </p>
          </div>
          <ShareLink listId={listId} />
        </motion.div>

        <div className="mb-6">
          <button
            onClick={() => {
              if (showForm && !editingGift) {
                setShowForm(false);
              } else {
                setEditingGift(null);
                setShowForm(!showForm);
              }
            }}
            className="bg-christmas-red text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            {showForm && !editingGift ? "❌ Cancelar" : "➕ Añadir regalo"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <GiftForm
                listId={listId}
                listData={listData}
                onSuccess={handleFormSuccess}
                editingGift={editingGift}
              />
              {editingGift && (
                <button
                  onClick={handleCancelForm}
                  className="mt-3 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  ❌ Cancelar edición
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listData.gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              isAdmin={true}
              onDelete={() => handleDeleteGift(gift.id)}
              onEdit={() => handleEditGift(gift)}
            />
          ))}
        </div>

        {listData.gifts.length === 0 && (
          <div className="text-center text-white text-xl mt-12">
            No hay regalos todavía. ¡Empieza a añadir! 🎁
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
