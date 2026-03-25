import Title from '@/shared/ui/Title';
import styles from './WelcomeCard.module.css';

interface WelcomeCardProps {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ title, text, image, imageAlt }) => {
  return (
    <div className={styles.welcome}>
      <img src={image} width={300} height={300} alt={imageAlt} className={styles.bulb} />
      <div className={styles.welcomeTextBlock}>
        <Title tag="h3" looksLike="h3" className={styles.welcomeTitle}>
          {title}
        </Title>
        <p className={styles.welcomeText}>{text}</p>
      </div>
    </div>
  );
};
