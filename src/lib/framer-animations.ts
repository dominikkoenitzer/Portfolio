
import { MotionProps } from "framer-motion";


export const fadeInUp: MotionProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInDown: MotionProps = {
  initial: { opacity: 0, y: -30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInLeft: MotionProps = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInRight: MotionProps = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const staggerContainer: MotionProps = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" }
};


export const staggerItem = (index: number): MotionProps => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay: 0.1 + index * 0.1
  },
  viewport: { once: true }
});


export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const liftOnHover = {
  whileHover: { y: -8 },
  transition: { duration: 0.4, ease: "easeInOut" }
};


export const buttonClick = {
  whileTap: { scale: 0.97 }
};


export const typingAnimationProps = {
  speed: 50,
  deletionSpeed: 80,
  wrapper: "span",
  cursor: true,
  repeat: Infinity
};
