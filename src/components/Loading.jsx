import React from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

const Loading = () => {
    return (
        <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loader-wrapper">
                <motion.div
                    className="loader-ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="loader-inner"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <motion.div
                className="loading-text"
                animate={{ backgroundPosition: ["0%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
                Carregando<span className="loading-dots">
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.33, 0.66] }}
                    >.</motion.span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, times: [0.33, 0.66, 1] }}
                    >.</motion.span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, times: [0.66, 1, 0] }}
                    >.</motion.span>
                </span>
            </motion.div>
        </motion.div>
    );
};

export default Loading;
