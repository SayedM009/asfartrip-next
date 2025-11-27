import { motion } from "framer-motion";
import SectionContainer from "../atoms/SectionContainer";

export default function AnimatedSection({ title, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <SectionContainer title={title}>{children}</SectionContainer>
        </motion.div>
    );
}
