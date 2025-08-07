import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, MapPin, DollarSign, Users, Clock, Settings, ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Field {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  image_url: string;
  field_type: 'football_5' | 'football_7' | 'football_11';
  capacity: number;
  description: string;
  available: boolean;
}

interface BookingData {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  field: {
    name: string;
  };
  player: {
    full_name: string;
  };
}

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myFields, setMyFields] = useState<Field[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    location: '',
    price_per_hour: '',
    field_type: 'football_5' as 'football_5' | 'football_7' | 'football_11',
    capacity: '',
    description: '',
    image_url: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOwnerData();
    }
  }, [user]);

  const fetchOwnerData = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        // Fetch owner's fields
        const { data: fields } = await supabase
          .from('fields')
          .select('*')
          .eq('owner_id', profile.id);

        setMyFields(fields || []);

        // Fetch recent bookings for owner's fields
        if (fields && fields.length > 0) {
          const fieldIds = fields.map(f => f.id);
          const { data: bookings } = await supabase
            .from('bookings')
            .select(`
              id, booking_date, start_time, end_time, status, total_price,
              field:fields(name),
              player:profiles(full_name)
            `)
            .in('field_id', fieldIds)
            .order('created_at', { ascending: false })
            .limit(10);

          setRecentBookings(bookings || []);
        }
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}${Date.now()}.${fileExt}`;
      const filePath = `fields/${fileName}`;

      // Simular progreso de carga
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const { error: uploadError, data } = await supabase.storage
        .from('field-images')
        .upload(filePath, file);

      clearInterval(interval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('field-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) {
        toast({
          title: "Error",
          description: "No se pudo encontrar tu perfil",
          variant: "destructive"
        });
        return;
      }

      let imageUrl = newField.image_url;
      const imageInput = document.getElementById('image_upload') as HTMLInputElement;
      if (imageInput?.files?.length) {
        try {
          imageUrl = await uploadImage(imageInput.files[0]);
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo subir la imagen",
            variant: "destructive"
          });
          return;
        }
      }

      const { error } = await supabase
        .from('fields')
        .insert({
          name: newField.name,
          location: newField.location,
          price_per_hour: parseFloat(newField.price_per_hour),
          field_type: newField.field_type,
          capacity: parseInt(newField.capacity),
          description: newField.description,
          image_url: imageUrl,
          owner_id: profile.id
        });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear la cancha",
          variant: "destructive"
        });
      } else {
        toast({
          title: "¡Éxito!",
          description: "Cancha creada correctamente"
        });
        setShowCreateForm(false);
        setNewField({
          name: '',
          location: '',
          price_per_hour: '',
          field_type: 'football_5' as 'football_5' | 'football_7' | 'football_11',
          capacity: '',
          description: '',
          image_url: ''
        });
        fetchOwnerData();
      }
    } catch (error) {
      console.error('Error creating field:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    }
  };

  const calculateStats = () => {
    const totalRevenue = recentBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + parseFloat(b.total_price.toString()), 0);
    
    const totalBookings = recentBookings.length;
    const activeFields = myFields.filter(f => f.available).length;
    const averageOccupancy = myFields.length > 0 ? Math.round((totalBookings / myFields.length) * 10) : 0;

    return { totalRevenue, totalBookings, activeFields, averageOccupancy };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Panel de Propietario</h1>
        <p className="text-muted-foreground">Gestiona tus canchas y reservas</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="fields">Mis Canchas</TabsTrigger>
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-foreground">${stats.totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-football-green" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reservas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
                  </div>
                  <Clock className="w-8 h-8 text-football-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ocupación Promedio</p>
                    <p className="text-2xl font-bold text-foreground">{stats.averageOccupancy}%</p>
                  </div>
                  <Users className="w-8 h-8 text-football-orange" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Canchas Activas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.activeFields}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Mis Canchas</h2>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Cancha
            </Button>
          </div>

          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Cancha</CardTitle>
                <CardDescription>Completa la información de tu cancha</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateField} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre de la Cancha</Label>
                      <Input
                        id="name"
                        value={newField.name}
                        onChange={(e) => setNewField({...newField, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={newField.location}
                        onChange={(e) => setNewField({...newField, location: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="field_type">Tipo de Cancha</Label>
                      <Select value={newField.field_type} onValueChange={(value: 'football_5' | 'football_7' | 'football_11') => setNewField({...newField, field_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="football_5">Fútbol 5</SelectItem>
                          <SelectItem value="football_7">Fútbol 7</SelectItem>
                          <SelectItem value="football_11">Fútbol 11</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacidad</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={newField.capacity}
                        onChange={(e) => setNewField({...newField, capacity: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Precio por Hora</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newField.price_per_hour}
                        onChange={(e) => setNewField({...newField, price_per_hour: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="image_upload">Imagen de la Cancha</Label>
                      <Input
                        id="image_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            // Preview de la imagen si lo deseas
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewField({...newField, image_url: event.target?.result as string});
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                      {isUploading && (
                        <div className="mt-2">
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Subiendo imagen... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newField.description}
                      onChange={(e) => setNewField({...newField, description: e.target.value})}
                      placeholder="Describe las características de tu cancha..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Crear Cancha</Button>
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFields.map((field) => (
              <Card key={field.id}>
                <div className="aspect-video bg-muted">
                  {field.image_url ? (
                    <img 
                      src={field.image_url} 
                      alt={field.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
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
                    <Badge variant={field.available ? "default" : "secondary"}>
                      {field.available ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>{field.field_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacidad:</span>
                      <span>{field.capacity} jugadores</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio/hora:</span>
                      <span className="font-medium">${field.price_per_hour}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {myFields.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes canchas registradas</h3>
                <p className="text-muted-foreground mb-4">
                  Comienza agregando tu primera cancha para recibir reservas.
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Cancha
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Reservas Recientes</h2>
          
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-medium">{booking.player.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.field.name} • {booking.booking_date} • {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'default' : 
                          booking.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {booking.status === 'confirmed' ? 'Confirmada' :
                         booking.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${booking.total_price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {recentBookings.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay reservas recientes</h3>
                <p className="text-muted-foreground">
                  Las reservas aparecerán aquí una vez que los jugadores reserven tus canchas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerDashboard;