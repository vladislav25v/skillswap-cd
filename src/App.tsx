import { Route, Routes } from 'react-router-dom';
import ProfileLayout from '@/pages/ProfilePage';
import ProfilePageForm from '@/pages/ProfilePage/ProfilePageForm';

function App() {
  return (
    <Routes>
      <Route path={'/profile'} element={<ProfileLayout />}>
        <Route index element={<ProfilePageForm />} />
      </Route>
    </Routes>
  );
}

export default App;
