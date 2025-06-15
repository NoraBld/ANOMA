import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BottomStats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <div ref={ref} className="flex flex-col gap-4 mt-6">
      {[1, 2].map((index) => (
        <motion.div
          key={index}
          className="bg-[#424769] text-white p-4 rounded-2xl shadow-md"
          variants={variants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
<div className='h-auto'>

          {index === 1 && (
            <>
             
 <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-semibold mb-2 text-[#e7d5ac]">Taux d'erreur moyen des modèles de pédiction</h3>
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 36 36">
                  <path
                    className="text-[#2d3250]"
                    stroke="currentColor" 
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#f9b17a]"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="15, 100"
                    fill="none"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  15%
                </div>
              </div>
            </div>

{/* </div> */}

            </>
          )}
          {index === 2 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-semibold mb-2 text-[#e7d5ac]">Taux d'erreur moyen des modèles de pédiction</h3>
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 36 36">
                  <path
                    className="text-[#2d3250]"
                    stroke="currentColor" 
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#f9b17a]"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="15, 100"
                    fill="none"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  15%
                </div>
              </div>
            </div>
          )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BottomStats;
