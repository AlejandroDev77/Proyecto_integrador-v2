import { motion } from "framer-motion";
import { fadeUp } from "../../utils/animations";

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    <motion.h2
      className="text-3xl md:text-4xl font-extrabold text-[#3a2f22]"
      {...fadeUp}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p className="text-gray-600 mt-3" {...fadeUp}>
        {subtitle}
      </motion.p>
    )}
  </div>
);
