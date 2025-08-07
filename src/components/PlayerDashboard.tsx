import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Star, Trophy, Target, Timer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BookingDialog } from './BookingDialog';
import { useToast } from "@/components/ui/use-toast";

interface PlayerStats {
  games_played: number;
  wins: number;
  goals_scored: number;
  level: string;
  position: string;
}

interface Field {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  image_url: string;
  field_type: string;
  capacity: number;
  description: string;
}

interface Booking {
  id: string;
  field_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  field: Field;
}

const PlayerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [availableFields, setAvailableFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      fetchPlayerData();
      fetchAvailableFields();
    }
  }, [user]);

  useEffect(() => {
    if (playerId) {
      fetchUserBookings();
    }
  }, [playerId]);

  const fetchUserBookings = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          field:fields (*)
        `)
        .eq('player_id', playerId)
        .order('booking_date', { ascending: true });

      if (error) throw error;
      
      const typedBookings = (bookings || []).map(booking => ({
        ...booking,
        status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed'
      }));
      
      setUserBookings(typedBookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      // Actualizar la lista de reservas
      fetchUserBookings();
      
      toast({
        title: "Reserva cancelada",
        description: "La reserva ha sido cancelada exitosamente",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva",
        variant: "destructive",
      });
    }
  };

  const fetchPlayerData = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setPlayerId(profile.id);
        const { data: stats } = await supabase
          .from('player_stats')
          .select('*')
          .eq('player_id', profile.id)
          .single();

        setPlayerStats(stats);
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  const fetchAvailableFields = async () => {
    try {
      const { data: fields } = await supabase
        .from('fields')
        .select('*')
        .eq('available', true);

      setAvailableFields(fields || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWinRate = () => {
    if (!playerStats || playerStats.games_played === 0) return 0;
    return Math.round((playerStats.wins / playerStats.games_played) * 100);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
        <p className="text-muted-foreground">Gestiona tu perfil y reserva canchas</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          <TabsTrigger value="bookings">Mis Reservas</TabsTrigger>
          <TabsTrigger value="fields">Reservar Canchas</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Player Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.charAt(0) || 'J'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    {user?.user_metadata?.full_name || 'Jugador'}
                  </CardTitle>
                  <CardDescription>
                    {playerStats?.position || 'Sin posición definida'} • Nivel {playerStats?.level || 'Principiante'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Partidos Jugados</p>
                    <p className="text-2xl font-bold text-foreground">{playerStats?.games_played || 0}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-football-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Victorias</p>
                    <p className="text-2xl font-bold text-foreground">{playerStats?.wins || 0}</p>
                  </div>
                  <Star className="w-8 h-8 text-football-green" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Goles</p>
                    <p className="text-2xl font-bold text-foreground">{playerStats?.goals_scored || 0}</p>
                  </div>
                  <Target className="w-8 h-8 text-football-orange" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">% Victorias</p>
                    <p className="text-2xl font-bold text-foreground">{calculateWinRate()}%</p>
                  </div>
                  <Timer className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {userBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{booking.field.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {booking.field.location}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        booking.status === 'cancelled'
                          ? 'destructive'
                          : booking.status === 'confirmed'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Horario:</span>
                      <span>
                        {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio Total:</span>
                      <span className="font-medium">${booking.total_price}</span>
                    </div>
                    {booking.status === 'pending' && (
                      <Button variant="destructive" className="w-full mt-4" onClick={() => handleCancelBooking(booking.id)}>
                        Cancelar Reserva
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {userBookings.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes reservas</h3>
                  <p className="text-muted-foreground">
                    Aún no has realizado ninguna reserva de cancha.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableFields.map((field) => (
              <Card key={field.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  {field.image_url ? (
                    <img 
                      src={field.image_url} 
                      alt={field.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{field.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {field.location}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{field.field_type.replace('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacidad:</span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {field.capacity} jugadores
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio por hora:</span>
                      <span className="font-medium">${field.price_per_hour}</span>
                    </div>
                    {field.description && (
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    )}
                    <Button 
                      className="w-full mt-4"
                      onClick={() => setSelectedField(field)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reservar Cancha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {availableFields.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay canchas disponibles</h3>
                <p className="text-muted-foreground">
                  No se encontraron canchas disponibles en este momento.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedField && playerId && (
        <BookingDialog
          isOpen={!!selectedField}
          onClose={() => setSelectedField(null)}
          field={selectedField}
          playerId={playerId}
        />
      )}
    </div>
  );
};

export default PlayerDashboard;