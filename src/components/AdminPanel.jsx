import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import GiftForm from "./GiftForm";
import GiftCard from "./GiftCard";
import ShareLink from "./ShareLink";

const AdminPanel = () => {
  const { listId } = useParams();
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadList();
  }, [listId]);

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

  const handleApproveRequest = async (giftId) => {
    try {
      const updatedGifts = listData.gifts.map((gift) =>
        gift.id === giftId
          ? { ...gift, status: "assigned", approvedByOwner: true }
          : gift
      );

      await updateDoc(doc(db, "lists", listId), { gifts: updatedGifts });
      setListData({ ...listData, gifts: updatedGifts });
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (giftId) => {
    try {
      const updatedGifts = listData.gifts.map((gift) =>
        gift.id === giftId
          ? {
              ...gift,
              status: "available",
              approvedByOwner: false,
              requestedBy: null,
            }
          : gift
      );

      await updateDoc(doc(db, "lists", listId), { gifts: updatedGifts });
      setListData({ ...listData, gifts: updatedGifts });
    } catch (error) {
      console.error("Error rejecting request:", error);
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

  const pendingRequests = listData.gifts.filter((g) => g.status === "pending");

  return (
    <div className="min-h-screen py-8 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6"
        >
          <h1 className="text-4xl font-bold text-christmas-red mb-2">
            🎄 {listData.listName}
          </h1>
          <p className="text-gray-600 mb-4">
            Panel de administración de {listData.ownerName}
          </p>
          <div className="bg-christmas-gold/20 p-3 rounded-lg mb-4">
            <p className="text-sm font-semibold">
              🔑 Código de acceso:{" "}
              <span className="font-mono">{listData.accessCode}</span>
            </p>
          </div>
          <ShareLink listId={listId} />
        </motion.div>

        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              ⏳ Solicitudes pendientes ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{gift.name}</p>
                    <p className="text-sm text-gray-600">
                      Solicitado por:{" "}
                      <span className="font-semibold">{gift.requestedBy}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveRequest(gift.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      onClick={() => handleRejectRequest(gift.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-christmas-red text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            {showForm ? "❌ Cancelar" : "➕ Añadir regalo"}
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
                onSuccess={() => {
                  setShowForm(false);
                  loadList();
                }}
              />
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
