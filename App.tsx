
import React, { useState, useCallback, useEffect } from 'react';
import { Checklist, Vehicle, View } from './types';
import ChecklistForm from './components/ChecklistForm';
import SupervisorDashboard from './components/SupervisorDashboard';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';


const initialMockVehicles: Vehicle[] = [
  { id: '1', plate: 'ABC-1234', model: 'Fiat Mobi', brand: 'Fiat', year: 2022 },
  { id: '2', plate: 'XYZ-5678', model: 'Renault Kwid', brand: 'Renault', year: 2023 },
  { id: '3', plate: 'QWE-9101', model: 'VW Gol', brand: 'Volkswagen', year: 2021 },
  { id: '4', plate: 'RTY-1121', model: 'Chevrolet Onix', brand: 'Chevrolet', year: 2023 },
];

const mockChecklists: Checklist[] = [
    {
        id: 'cl1',
        responsibleName: 'John Doe',
        vehiclePlate: 'ABC-1234',
        mileage: 54321,
        returnMileage: 54450,
        checklistItems: [
            { id: 'exterior', label: 'Condição externa (lataria, vidros, faróis)', status: 'OK' },
            { id: 'interior', label: 'Condição interna (bancos, painel, limpeza)', status: 'OK' },
            { id: 'fuel', label: 'Nível de combustível', status: 'OK' },
            { id: 'tires', label: 'Calibragem e estado dos pneus', status: 'NOT_OK' },
            { id: 'equipment', label: 'Equipamentos obrigatórios (triângulo, macaco)', status: 'OK' },
        ],
        photos: [],
        observations: 'Pneu dianteiro direito parece um pouco murcho.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'cl2',
        responsibleName: 'Jane Smith',
        vehiclePlate: 'XYZ-5678',
        mileage: 12345,
        checklistItems: [
            { id: 'exterior', label: 'Condição externa (lataria, vidros, faróis)', status: 'OK' },
            { id: 'interior', label: 'Condição interna (bancos, painel, limpeza)', status: 'OK' },
            { id: 'fuel', label: 'Nível de combustível', status: 'OK' },
            { id: 'tires', label: 'Calibragem e estado dos pneus', status: 'OK' },
            { id: 'equipment', label: 'Equipamentos obrigatórios (triângulo, macaco)', status: 'OK' },
        ],
        photos: [],
        observations: '',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
    }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.EMPLOYEE);
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialMockVehicles);
  const [session, setSession] = useState<Session | null>(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  const addChecklist = useCallback((checklist: Omit<Checklist, 'id' | 'timestamp'>) => {
    const newChecklist: Checklist = {
      ...checklist,
      id: `cl${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChecklists(prevChecklists => [newChecklist, ...prevChecklists]);
  }, []);

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `vh${Date.now()}`,
    };
    setVehicles(prevVehicles => [newVehicle, ...prevVehicles]);
  }, []);

  const deleteVehicle = useCallback((vehicleId: string) => {
    setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleId));
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