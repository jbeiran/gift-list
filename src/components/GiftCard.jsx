import { motion } from "framer-motion";

const GiftCard = ({ gift, isAdmin, onRequest, onDelete, onEdit }) => {
  const getStatusBadge = () => {
    switch (gift.status) {
      case "assigned":
        return (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ✅ Reservado
          </span>
        );
      default:
        return (
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            💫 Disponible
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
    >
      {gift.image && (
        <div className="h-48 overflow-hidden bg-gray-200 shrink-0">
          <img
            src={gift.image}
            alt={gift.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{gift.name}</h3>
          {/* Solo mostrar el badge si NO es admin */}
          {!isAdmin && getStatusBadge()}
        </div>

        {gift.description && (
          <p className="text-gray-600 text-sm mb-3">{gift.description}</p>
        )}

        {gift.price > 0 && (
          <p className="text-christmas-green font-bold text-lg mb-3">
            {gift.price.toFixed(2)} €
          </p>
        )}

        {/* Solo mostrar quién lo eligió si NO es admin */}
        {!isAdmin && gift.status === "assigned" && gift.requestedBy && (
          <p className="text-sm text-green-700 mb-3">
            🎁 Elegido por:{" "}
            <span className="font-semibold">{gift.requestedBy}</span>
          </p>
        )}

        {/* Espaciador que empuja los botones hacia abajo */}
        <div className="grow"></div>

        <div className="flex gap-2 mt-auto">
          {gift.url && (
            <a
              href={gift.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-300 transition text-sm font-semibold"
            >
              🔗 Ver producto
            </a>
          )}

          {!isAdmin && gift.status === "available" && (
            <button
              onClick={onRequest}
              className="flex-1 bg-christmas-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
            >
              🎁 Quiero este
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
              >
                ✏️
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GiftCard;
