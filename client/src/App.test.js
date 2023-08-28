import { createRoot } from 'react-dom/client';
import App from './App';

test('renders learn react link', () => {
  const root = createRoot(document.createElement('div'));
  root.render(<App />);
  
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
