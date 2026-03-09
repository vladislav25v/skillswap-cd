import React, { useEffect, useState } from 'react';
import Avatar from '../Avatar';

interface User {
  name: string;
  photo?: string;
}

const AvatarTest = () => {
  const [randomUser, setRandomUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/db/users.json')
      .then((res) => res.json())
      .then((data: User[]) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomUser(data[randomIndex]);
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
      <h1 style={{ marginBottom: '40px' }}>Тестирование Avatar компонента</h1>

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
