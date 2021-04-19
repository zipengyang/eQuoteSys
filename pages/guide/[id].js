// import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const images = [
  '../../spec.jpg',
  '../../contact-form.jpg',
  '../../signin.jpg',
  '../../signin.jpg',
];
let easing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const step = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
      <div className="fullscreen">
        <div className="step">
          <motion.div
            className="img"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            <motion.img
              key={images[id - 1]}
              src={images[id - 1]}
              // src="../../spec.jpg"
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: 200, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            />
          </motion.div>
          <div className="step-details">
            <motion.div variants={stagger} className="inner">
              <Link href="/">
                <motion.div variants={fadeInUp}>
                  <a className="go-back">Back to Home page</a>
                </motion.div>
              </Link>
              <motion.div variants={fadeInUp}>
                <span className="category">Instruction:</span>
              </motion.div>
              <motion.p variants={fadeInUp}>instrction 1:</motion.p>
              <motion.p variants={fadeInUp}>instrction 2:</motion.p>
              <motion.p variants={fadeInUp}>instrction 3:</motion.p>
              <motion.p variants={fadeInUp}>instrction 4:</motion.p>
              <motion.p variants={fadeInUp}>instrction 5:</motion.p>

              <motion.div variants={fadeInUp} className="btn-row">
                {id > 1 && (
                  <Link href={`/guide/${id - 1}`}>
                    <a>
                      {' '}
                      <ArrowBackIosIcon />
                      Previous Step
                    </a>
                  </Link>
                )}
                <button className="add-to-cart"> Start A Quote</button>
                {id < 4 && (
                  <Link href={`/guide/${Number(id) + 1}`}>
                    <a className="subscribe">
                      Next Step <ArrowForwardIosIcon />
                    </a>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default step;
