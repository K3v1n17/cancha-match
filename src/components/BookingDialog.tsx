import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addHours, format, parse, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field: {
    id: string;
    name: string;
    price_per_hour: number;
  };
  playerId: string;
}

const AVAILABLE_HOURS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8; // Empezando desde las 8:00 AM
  return {
    value: `${hour}:00`,
    label: `${hour}:00`,
  };
});

export function BookingDialog({ isOpen, onClose, field, playerId }: BookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('1');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (!date || !startTime || !duration) {
      toast({
        title: "Error",
        description: "Por favor selecciona fecha, hora y duración",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Crear objetos Date para start_time y end_time
      const startDateTime = parse(startTime, 'H:mm', date);
      const endDateTime = addHours(startDateTime, parseInt(duration));

      const booking = {
        field_id: field.id,
        player_id: playerId,
        booking_date: format(date, 'yyyy-MM-dd'),
        start_time: format(startDateTime, 'HH:mm:ss'),
        end_time: format(endDateTime, 'HH:mm:ss'),
        total_price: field.price_per_hour * parseInt(duration),
        status: 'pending'
      };

      // Verificar si ya existe una reserva para ese horario
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('field_id', field.id)
        .eq('booking_date', booking.booking_date)
        .neq('status', 'cancelled')
        .or(`start_time.lt.${booking.end_time},end_time.gt.${booking.start_time}`);

      if (existingBookings && existingBookings.length > 0) {
        toast({
          title: "Error",
          description: "Ya existe una reserva para este horario",
          variant: "destructive",
        });
        return;
      }

      // Crear la reserva
      const { error } = await supabase
        .from('bookings')
        .insert([booking]);

      if (error) throw error;

      toast({
        title: "¡Reserva exitosa!",
        description: "Tu reserva ha sido registrada correctamente",
      });
      onClose();
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la reserva",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reservar Cancha</DialogTitle>
          <DialogDescription>
            {field.name} - ${field.price_per_hour}/hora
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={es}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startTime">Hora de inicio</label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_HOURS.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="duration">Duración (horas)</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((hours) => (
                    <SelectItem key={hours} value={hours.toString()}>
                      {hours} {hours === 1 ? 'hora' : 'horas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleBooking} disabled={isLoading}>
            {isLoading ? "Reservando..." : "Confirmar Reserva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
