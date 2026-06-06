import { useNavigate } from 'react-router-dom';
import CheckoutPage from '../../components/CheckoutPage';

interface CheckoutPageWrapperProps {
  onSuccess: () => void;
}

export default function CheckoutPageWrapper({ onSuccess }: CheckoutPageWrapperProps) {
  const navigate = useNavigate();

  return (
    <CheckoutPage 
      onBack={() => navigate('/')} 
      onSuccess={onSuccess} 
    />
  );
}
