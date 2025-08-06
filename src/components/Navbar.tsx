import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Users, Trophy, MapPin, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [activeRole, setActiveRole] = useState<'player' | 'owner' | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">FutbolApp</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#canchas" className="text-muted-foreground hover:text-foreground transition-colors">
              Canchas
            </a>
            <a href="#jugadores" className="text-muted-foreground hover:text-foreground transition-colors">
              Jugadores
            </a>
            <a href="#torneos" className="text-muted-foreground hover:text-foreground transition-colors">
              Torneos
            </a>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden md:block">
                  Hola, {user.user_metadata?.full_name || user.email}
                </span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={activeRole === 'player' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveRole('player')}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Jugador
                  </Button>
                  <Button 
                    variant={activeRole === 'owner' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveRole('owner')}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Propietario
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Iniciar Sesión
                </Button>
                <Button variant="default" onClick={() => navigate('/auth')}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;