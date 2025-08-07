import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FieldsSection from "@/components/FieldsSection";
import PlayersSection from "@/components/PlayersSection";
import PlayerDashboard from "@/components/PlayerDashboard";
import OwnerDashboard from "@/components/OwnerDashboard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [fetchingRole, setFetchingRole] = useState(false);

  useEffect(() => {
    if (user && !fetchingRole) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    setFetchingRole(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      setUserRole(profile?.role || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setFetchingRole(false);
    }
  };

  if (loading || (user && fetchingRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show role-specific dashboard
  if (user && userRole) {
    return (
      <div className="min-h-screen">
        <Navbar />
        {userRole === 'player' ? <PlayerDashboard /> : <OwnerDashboard />}
      </div>
    );
  }

  // If user is not authenticated, show landing page
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FieldsSection />
      <PlayersSection />
    </div>
  );
};

export default Index;
