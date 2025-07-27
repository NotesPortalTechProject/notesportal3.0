'use client'
import { useOptimistic, useTransition } from 'react';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { ToggleFiletoFavourites } from '@/actions/other-actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavFormBtn({ initialIsFav, fileid, userid, src }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFav, setOptimisticFav] = useOptimistic(initialIsFav);

  const toggleFav = () => {
    startTransition(() => {
      setOptimisticFav(prev => !prev);
      ToggleFiletoFavourites(fileid, userid, src);
    });
  };

  return (
    <button
      onClick={toggleFav}
      disabled={isPending}
      className="transition-transform active:scale-95"
    >
      <AnimatePresence mode="wait" initial={false}>
        {optimisticFav ? (
          <motion.span
            key="filled"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AiFillStar className="text-yellow-400 text-2xl" />
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AiOutlineStar className="text-2xl" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
