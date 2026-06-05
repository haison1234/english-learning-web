import { useParams, useNavigate } from 'react-router-dom';
import CourseDetail from '../../components/CourseDetail';

interface CourseDetailPageProps {
  user: any;
  onLogout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onCertificateClick: () => void;
  onPricingClick: () => void;
  onCartClick: () => void;
}

export default function CourseDetailPage({
  user,
  onLogin,
  onCartClick,
}: CourseDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <CourseDetail 
      courseId={id}
      onBack={() => navigate('/')}
      onEnroll={() => {
        if (user) {
          navigate('/student/checkout');
        } else {
          onLogin();
        }
      }}
      onCartOpen={onCartClick}
      isLoggedIn={!!user}
    />
  );
}
