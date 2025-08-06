import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Trophy, Star } from "lucide-react";
import heroImage from "@/assets/hero-football-field.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Reserva tu cancha
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-foreground">
            Conecta con jugadores
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            La plataforma definitiva para gestionar reservas de canchas de fútbol y construir tu comunidad deportiva
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <Users className="w-5 h-5 mr-2" />
              Soy Jugador
            </Button>
            <Button variant="owner" size="lg" className="text-lg px-8 py-4">
              <MapPin className="w-5 h-5 mr-2" />
              Soy Propietario
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-card backdrop-blur-sm border-primary/20 shadow-football">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Encuentra Canchas</h3>
                <p className="text-muted-foreground">
                  Explora canchas cercanas con horarios y precios actualizados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-sm border-primary/20 shadow-football">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Conecta Jugadores</h3>
                <p className="text-muted-foreground">
                  Encuentra compañeros de equipo y construye tu red deportiva
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-sm border-primary/20 shadow-football">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-football-orange" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Únete a Torneos</h3>
                <p className="text-muted-foreground">
                  Participa en competencias locales y mejora tu nivel
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-8 text-center">
          <div className="text-white">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm opacity-80">Canchas</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">2.5K+</div>
            <div className="text-sm opacity-80">Jugadores</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">150+</div>
            <div className="text-sm opacity-80">Torneos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;