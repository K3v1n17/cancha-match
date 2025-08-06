import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Trophy, Target, Calendar, MapPin } from "lucide-react";

interface PlayerProfileProps {
  name: string;
  position: string;
  avatar: string;
  level: string;
  gamesPlayed: number;
  wins: number;
  goalsScored: number;
  location: string;
  joinedDate: string;
  isOnline: boolean;
}

const PlayerProfile = ({
  name,
  position,
  avatar,
  level,
  gamesPlayed,
  wins,
  goalsScored,
  location,
  joinedDate,
  isOnline
}: PlayerProfileProps) => {
  const winRate = Math.round((wins / gamesPlayed) * 100);

  return (
    <Card className="max-w-md mx-auto bg-gradient-card shadow-football">
      <CardHeader className="text-center relative">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 mx-auto border-4 border-primary">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-football-green rounded-full border-2 border-background"></div>
          )}
        </div>
        
        <CardTitle className="text-2xl text-foreground mt-4">{name}</CardTitle>
        <Badge variant="outline" className="mt-2">
          {position}
        </Badge>
        <Badge variant="secondary" className="ml-2">
          Nivel {level}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location & Join Date */}
        <div className="space-y-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Miembro desde {joinedDate}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{gamesPlayed}</div>
            <div className="text-xs text-muted-foreground">Partidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-football-green">{winRate}%</div>
            <div className="text-xs text-muted-foreground">Victorias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-football-orange">{goalsScored}</div>
            <div className="text-xs text-muted-foreground">Goles</div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rendimiento</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(winRate / 20) ? 'bg-football-green' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="player" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Mensaje
          </Button>
          <Button variant="outline" className="flex-1">
            <Trophy className="w-4 h-4 mr-2" />
            Invitar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;