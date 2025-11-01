import { useState } from "react";
import { motion } from "framer-motion";

const ShareLink = ({ listId }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/lista/${listId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-christmas-green/10 p-4 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-2">
        📤 Comparte este enlace con tus amigos:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            copied
              ? "bg-green-500 text-white"
              : "bg-christmas-green text-white hover:bg-green-700"
          }`}
        >
          {copied ? "✅ Copiado" : "📋 Copiar"}
        </motion.button>
      </div>
    </div>
  );
};

export default ShareLink;
