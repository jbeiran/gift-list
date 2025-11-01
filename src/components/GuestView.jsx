import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import GiftCard from "./GiftCard";
import RequestForm from "./RequestForm";

const GuestView = () => {
  const { listId } = useParams();
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState(null);

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

  return (
    <div className="min-h-screen py-8 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6 text-center"
        >
          <h1 className="text-4xl font-bold text-christmas-red mb-2">
            🎄 {listData.listName}
          </h1>
          <p className="text-gray-600">
            Lista de regalos de {listData.ownerName}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Selecciona un regalo para solicitar comprarlo 🎁
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listData.gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              isAdmin={false}
              onRequest={() => setSelectedGift(gift)}
            />
          ))}
        </div>

        {listData.gifts.length === 0 && (
          <div className="text-center text-white text-xl mt-12">
            Aún no hay regalos en esta lista 🎁
          </div>
        )}
      </div>

      {selectedGift && (
        <RequestForm
          gift={selectedGift}
          listId={listId}
          listData={listData}
          onClose={() => setSelectedGift(null)}
          onSuccess={() => {
            setSelectedGift(null);
            loadList();
          }}
        />
      )}
    </div>
  );
};

export default GuestView;
