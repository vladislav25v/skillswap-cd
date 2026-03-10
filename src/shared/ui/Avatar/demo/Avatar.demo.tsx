import { useEffect, useState } from 'react';
import Avatar from '../Avatar';

interface User {
  name: string;
  photo?: string;
}

interface DbData {
  users: User[];
}

const AvatarTest = () => {
  const [randomUser, setRandomUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/db/db.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: DbData) => {
        const users = data.users;
        if (users && users.length > 0) {
          const randomIndex = Math.floor(Math.random() * users.length);
          setRandomUser(users[randomIndex]);
        } else {
          console.error('Нет пользователей в данных');
        }
      })
      .catch((err) => console.error('Ошибка загрузки:', err));
  }, []);

  if (!randomUser) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>;
  }

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: '40px' }}>Демонстрация Avatar компонента</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>Photo</h2>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Avatar src={randomUser.photo} alt={randomUser.name} size="large" />
          <Avatar src={randomUser.photo} alt={randomUser.name} size="medium" />
          <Avatar src={randomUser.photo} alt={randomUser.name} size="small" />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Placeholder</h2>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Avatar alt={randomUser.name} size="large" />
          <Avatar alt={randomUser.name} size="medium" />
          <Avatar alt={randomUser.name} size="small" />
        </div>
      </section>
    </div>
  );
};

export default AvatarTest;
