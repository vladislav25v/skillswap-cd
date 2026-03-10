import Button from './shared/ui/Button/Button';
import Nav from './shared/ui/Nav/Nav';
import AvatarTest from './shared/ui/Avatar/test/Avatar.test';

function App() {
  const handleClick = () => {
    console.log('Кнопка нажата!');
  };

  return (
    <>
      {/* Основной интерфейс */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <Nav />
        <h1>Проектный месяц</h1>
        <Button variant="secondary">Войти</Button>
        <Button variant="primary" onClick={handleClick}>
          Зарегистрироваться
        </Button>
      </div>

      {/* Тесты Avatar */}
      <AvatarTest />
    </>
  );
}

export default App;
