import { AlignHorizontalDistributeCenter } from 'lucide-react';
import styles from './Button.module.css';

const Button = () => {
  return (
    <>
      <div>
        <AlignHorizontalDistributeCenter />
      </div>
      <button className={`h1 ${styles.button}`}>кнопка</button>;
    </>
  );
};

export default Button;
