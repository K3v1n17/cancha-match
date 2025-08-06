import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users } from "lucide-react";

interface FieldCardProps {
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  available: boolean;
  nextSlot: string;
  capacity: string;
}

const FieldCard = ({ 
  name, 
  location, 
  price, 
  rating, 
  image, 
  available, 
  nextSlot, 
  capacity 
}: FieldCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-football transition-all duration-300 transform hover:scale-105 bg-gradient-card">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={available ? "default" : "secondary"} className="bg-background/90">
            {available ? "Disponible" : "Ocupada"}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-background/90 rounded-full px-2 py-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground">{name}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {nextSlot}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            {capacity}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">{price}</span>
            <span className="text-muted-foreground">/hora</span>
          </div>
          <Button variant="player" className="px-6">
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldCard;