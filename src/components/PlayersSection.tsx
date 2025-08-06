import PlayerProfile from "./PlayerProfile";
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";

const PlayersSection = () => {
  const players = [
    {
      name: "Carlos Mendoza",
      position: "Delantero",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      level: "Avanzado",
      gamesPlayed: 47,
      wins: 32,
      goalsScored: 23,
      location: "Palermo, CABA",
      joinedDate: "Marzo 2024",
      isOnline: true
    },
    {
      name: "María González",
      position: "Mediocampista",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c9bd?w=150&h=150&fit=crop&crop=face",
      level: "Intermedio",
      gamesPlayed: 29,
      wins: 18,
      goalsScored: 8,
      location: "San Telmo, CABA",
      joinedDate: "Abril 2024",
      isOnline: false
    },
    {
      name: "Diego Torres",
      position: "Defensor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      level: "Experto",
      gamesPlayed: 63,
      wins: 45,
      goalsScored: 5,
      location: "Belgrano, CABA",
      joinedDate: "Enero 2024",
      isOnline: true
    }
  ];

  return (
    <section className="py-20" id="jugadores">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Conecta con Jugadores
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra compañeros de equipo y forma tu grupo ideal
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="outline" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </Button>
          <Button variant="outline">Por Posición</Button>
          <Button variant="outline">Por Nivel</Button>
          <Button variant="outline">Por Zona</Button>
          <Button variant="outline">En línea</Button>
        </div>

        {/* Players Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {players.map((player, index) => (
            <PlayerProfile key={index} {...player} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="accent" size="lg">
            <Users className="w-5 h-5 mr-2" />
            Ver Todos los Jugadores
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlayersSection;