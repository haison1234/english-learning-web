import Hero from '../../components/Hero';
import About from '../../components/About';
import Collection from '../../components/Collection';
import CTA from '../../components/CTA';

interface HomePageProps {
  user: any;
  onLogout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onCertificateClick: () => void;
  onCartClick?: () => void;
}

export default function HomePage({
  user,
  onLogout,
  onLogin,
  onRegister,
  onCertificateClick,
  onCartClick,
}: HomePageProps) {
  return (
    <>
      <Hero
        user={user}
        onLogout={onLogout}
        onLogin={onLogin}
        onRegister={onRegister}
        onCertificateClick={onCertificateClick}
        onDashboardClick={() => {}} // Hero will use navigate now
        onCartClick={onCartClick}
      />
      <About />
      <Collection
        isLoggedIn={!!user}
        onLogin={onLogin}
        onCartOpen={onCartClick}
      />
      <CTA onRegisterClick={onRegister} />
    </>
  );
}
