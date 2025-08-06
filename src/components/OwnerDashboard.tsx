import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users, Plus, MapPin, Clock, Settings } from "lucide-react";

const OwnerDashboard = () => {
  const myFields = [
    {
      name: "Cancha Premium Norte",
      location: "Belgrano, CABA",
      revenue: "$45,200",
      bookings: 23,
      occupancy: 85
    },
    {
      name: "Futsal Club Center",
      location: "Palermo, CABA", 
      revenue: "$32,800",
      bookings: 18,
      occupancy: 72
    }
  ];

  const recentBookings = [
    { time: "18:00 - 19:00", player: "Carlos M.", field: "Cancha Norte", status: "Confirmada" },
    { time: "19:30 - 20:30", player: "María G.", field: "Futsal Center", status: "Pendiente" },
    { time: "21:00 - 22:00", player: "Diego T.", field: "Cancha Norte", status: "Confirmada" }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Dashboard Propietario
          </h2>
          <p className="text-xl text-muted-foreground">
            Gestiona tus canchas y maximiza tus ingresos
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card shadow-football">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Ingresos Mensuales</p>
                  <p className="text-3xl font-bold text-football-green">$78,000</p>
                </div>
                <DollarSign className="w-12 h-12 text-football-green opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-football">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Reservas Totales</p>
                  <p className="text-3xl font-bold text-football-blue">41</p>
                </div>
                <Calendar className="w-12 h-12 text-football-blue opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-football">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Ocupación Media</p>
                  <p className="text-3xl font-bold text-football-orange">78%</p>
                </div>
                <Users className="w-12 h-12 text-football-orange opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-football">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Canchas Activas</p>
                  <p className="text-3xl font-bold text-primary">2</p>
                </div>
                <MapPin className="w-12 h-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Fields */}
          <Card className="bg-gradient-card shadow-football">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-foreground">Mis Canchas</CardTitle>
              <Button variant="owner" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva Cancha
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {myFields.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 bg-background/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{field.name}</h3>
                      <p className="text-muted-foreground text-sm flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {field.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-football-green">{field.revenue}</p>
                      <p className="text-xs text-muted-foreground">Ingresos</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-football-blue">{field.bookings}</p>
                      <p className="text-xs text-muted-foreground">Reservas</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-football-orange">{field.occupancy}%</p>
                      <p className="text-xs text-muted-foreground">Ocupación</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="bg-gradient-card shadow-football">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Reservas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{booking.time}</p>
                        <p className="text-sm text-muted-foreground">{booking.player} - {booking.field}</p>
                      </div>
                    </div>
                    <Badge variant={booking.status === "Confirmada" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver Todas las Reservas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OwnerDashboard;