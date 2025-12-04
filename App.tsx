
import ChecklistForm from './components/ChecklistForm';
import SupervisorDashboard from './components/SupervisorDashboard';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.EMPLOYEE);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  const fetchVehicles = useCallback(async () => {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) {
      console.error('Erro ao buscar veículos:', error);
    } else {
      setVehicles(data as Vehicle[]);
    }
  }, []);

  const fetchChecklists = useCallback(async () => {
    const { data, error } = await supabase.from('checklists').select('*');
    if (error) {
      console.error('Erro ao buscar checklists:', error);
    } else {
      // É importante transformar os nomes das colunas de snake_case para camelCase
      const formattedChecklists = data.map(item => ({
        id: item.id,
        responsible_name: item.responsible_name,
        vehiclePlate: item.vehicle_plate,
        mileage: item.mileage,
        returnMileage: item.return_mileage,
        checklistItems: item.checklist_items,
        photos: item.photos,
        observations: item.observations,
        timestamp: item.timestamp,
        vehicle_id: item.vehicle_id,
      }));
      setChecklists(formattedChecklists as Checklist[]);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchChecklists();
  }, [session, fetchVehicles, fetchChecklists]);


  const addChecklist = useCallback(async (checklist: Omit<Checklist, 'id' | 'timestamp' | 'vehicle_id'>) => {
    // Buscar o vehicle_id com base no vehiclePlate
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id')
      .eq('plate', checklist.vehicle_plate)
      .single();

    if (vehicleError || !vehicleData) {
      console.error('Erro ao buscar ID do veículo:', vehicleError?.message);
      alert('Veículo não encontrado. Por favor, verifique a placa.');
      return;
    }

    const newChecklist = {
      responsible_name: checklist.responsible_name,
      vehicle_plate: checklist.vehicle_plate,
      mileage: checklist.mileage,
      return_mileage: checklist.return_mileage,
      checklist_items: checklist.checklist_items,
      photos: checklist.photos,
      observations: checklist.observations,
      timestamp: new Date().toISOString(),
      vehicle_id: vehicleData.id,
    };

    const { data, error } = await supabase
      .from('checklists')
      .insert([newChecklist])
      .select();

    if (error) {
      console.error('Erro ao adicionar checklist:', error);
    } else if (data && data.length > 0) {
      // Formatar os dados retornados do Supabase para o formato da interface Checklist
      const addedChecklist: Checklist = {
        id: data[0].id,
        responsible_name: data[0].responsible_name,
        vehicle_plate: data[0].vehicle_plate,
        mileage: data[0].mileage,
        return_mileage: data[0].return_mileage,
        checklist_items: data[0].checklist_items,
        photos: data[0].photos,
        observations: data[0].observations,
        timestamp: data[0].timestamp,
        vehicle_id: data[0].vehicle_id,
      };
      setChecklists(prevChecklists => [addedChecklist, ...prevChecklists]);
    }
  }, []);

  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, 'id'>) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        plate: vehicle.plate,
        model: vehicle.model,
        brand: vehicle.brand,
        year: vehicle.year,
      }])
      .select();

    if (error) {
      console.error('Erro ao adicionar veículo:', error);
      alert(`Erro ao adicionar veículo: ${error.message}. A placa ${vehicle.plate} já pode existir.`);
    } else if (data && data.length > 0) {
      setVehicles(prevVehicles => [...prevVehicles, data[0] as Vehicle]);
    }
  }, []);

  const deleteVehicle = useCallback(async (vehicleId: string) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      console.error('Erro ao deletar veículo:', error);
      alert(`Erro ao deletar veículo: ${error.message}.`);
    } else {
      setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleId));
      // Optionally, also delete related checklists or update them to nullify vehicle_id
      // For now, we just delete the vehicle.
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-black text-green-700 tracking-tight">
              VipTelecom
            </h1>
            <nav className="mt-4 md:mt-0 flex items-center space-x-2">
              <button
                onClick={() => setView(View.EMPLOYEE)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === View.EMPLOYEE
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-transparent text-green-700 hover:bg-green-50'
                }`}
              >
                Formulário
              </button>
              <button
                onClick={() => setView(View.SUPERVISOR)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === View.SUPERVISOR
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-transparent text-green-700 hover:bg-green-50'
                }`}
              >
                Painel do Supervisor
              </button>
              {session && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow"
                >
                  Sair
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {view === View.EMPLOYEE ? (
          <ChecklistForm vehicles={vehicles} onSubmit={addChecklist} />
        ) : (
          session ? (
            <SupervisorDashboard 
              checklists={checklists} 
              vehicles={vehicles}
              onAddVehicle={addVehicle}
              onDeleteVehicle={deleteVehicle} 
            />
          ) : (
            <Login />
          )
        )}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} VipTelecom Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;