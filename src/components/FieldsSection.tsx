import FieldCard from "./FieldCard";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";
import field1 from "@/assets/field-1.jpg";
import field2 from "@/assets/field-2.jpg";
import field3 from "@/assets/field-3.jpg";

const FieldsSection = () => {
  const fields = [
    {
      name: "Cancha Premium San Martín",
      location: "San Martín, Buenos Aires",
      price: "$3,500",
      rating: 4.8,
      image: field1,
      available: true,
      nextSlot: "18:00 - 19:00",
      capacity: "10 vs 10"
    },
    {
      name: "Futsal Club Norte",
      location: "Zona Norte, CABA",
      price: "$2,800",
      rating: 4.6,
      image: field2,
      available: true,
      nextSlot: "19:30 - 20:30",
      capacity: "5 vs 5"
    },
    {
      name: "Campo Verde Sunset",
      location: "Tigre, Buenos Aires",
      price: "$4,200",
      rating: 4.9,
      image: field3,
      available: false,
      nextSlot: "20:00 - 21:00",
      capacity: "11 vs 11"
    }
  ];

  return (
    <section className="py-20 bg-muted/20" id="canchas">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Canchas Disponibles
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra la cancha perfecta para tu próximo partido
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="outline" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Ubicación</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Precio</span>
          </Button>
          <Button variant="outline">Disponibilidad</Button>
          <Button variant="outline">Capacidad</Button>
        </div>

        {/* Fields Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {fields.map((field, index) => (
            <FieldCard key={index} {...field} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="player" size="lg">
            Ver Todas las Canchas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FieldsSection;