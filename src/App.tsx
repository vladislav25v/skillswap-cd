import Button from './shared/ui/Button/Button';
import Nav from './shared/ui/Nav/Nav';
import AvatarDemo from './shared/ui/Avatar/demo/Avatar.demo';
import FilterCheckboxGroupDemo from './shared/ui/FilterCheckboxGroup/demo/FilterCheckboxGroup.demo';

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

      {/* Демонстрация компонентов */}
      <AvatarDemo />
      <FilterCheckboxGroupDemo />
    </>
  );
}

export default App;
