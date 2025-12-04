
import React, { useState, useMemo } from 'react';
import { Checklist, Vehicle } from '../types';
import ChecklistDetailModal from './ChecklistDetailModal';
import ManageVehiclesModal from './ManageVehiclesModal';
import { AlertIcon, CheckCircleIcon, CogIcon } from './icons/Icons';

interface SupervisorDashboardProps {
  checklists: Checklist[];
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onDeleteVehicle: (vehicleId: string) => void;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ checklists, vehicles, onAddVehicle, onDeleteVehicle }) => {
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  const filteredChecklists = useMemo(() => {
    return checklists.filter(c => {
      const hasIssue = c.checklist_items.some(item => item.status === 'NOT_OK') || c.observations;
      if (filterVehicle !== 'all' && c.vehicle_plate !== filterVehicle) return false;
      if (filterEmployee && !c.responsible_name.toLowerCase().includes(filterEmployee.toLowerCase())) return false;
      if (filterStatus === 'issues' && !hasIssue) return false;
      if (filterStatus === 'ok' && hasIssue) return false;
      if (filterDate && !c.timestamp.startsWith(filterDate)) return false;
      return true;
    });
  }, [checklists, filterVehicle, filterEmployee, filterStatus, filterDate]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-2xl border-t-4 border-green-600">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Painel do Supervisor</h2>
            <button 
                onClick={() => setIsManageModalOpen(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
            >
                <CogIcon className="h-5 w-5 mr-2" />
                Gerenciar Veículos
            </button>
        </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="filterVehicle" className="block text-sm font-medium text-gray-700">Filtrar por Veículo</label>
          <select id="filterVehicle" value={filterVehicle} onChange={e => setFilterVehicle(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="all">Todos os Veículos</option>
            {vehicles.map(v => <option key={v.id} value={v.plate}>{v.plate}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filterEmployee" className="block text-sm font-medium text-gray-700">Filtrar por Funcionário</label>
          <input type="text" id="filterEmployee" value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} placeholder="Nome do funcionário" className="mt-1 block w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
        </div>
        <div>
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700">Filtrar por Status</label>
          <select id="filterStatus" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="all">Todos</option>
            <option value="issues">Com Problemas</option>
            <option value="ok">Sem Problemas</option>
          </select>
        </div>
        <div>
            <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700">Filtrar por Data</label>
            <input type="date" id="filterDate" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="mt-1 block w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Data</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Funcionário</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Veículo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">KM Retirada</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">KM Devolução</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ver</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredChecklists.length > 0 ? filteredChecklists.map(c => {
              const hasIssue = c.checklist_items.some(item => item.status === 'NOT_OK') || c.observations;
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hasIssue ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertIcon className="h-4 w-4 mr-1"/> Problema</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircleIcon className="h-4 w-4 mr-1"/> OK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(c.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.responsible_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.vehicle_plate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.mileage.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {c.return_mileage ? c.return_mileage.toLocaleString('pt-BR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedChecklist(c)} className="text-green-600 hover:text-green-800 font-semibold">Ver Detalhes</button>
                  </td>
                </tr>
              );
            }) : (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                        Nenhum checklist encontrado com os filtros selecionados.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedChecklist && (
        <ChecklistDetailModal checklist={selectedChecklist} onClose={() => setSelectedChecklist(null)} />
      )}
      {isManageModalOpen && (
        <ManageVehiclesModal 
            vehicles={vehicles}
            onClose={() => setIsManageModalOpen(false)}
            onAddVehicle={onAddVehicle}
            onDeleteVehicle={onDeleteVehicle}
        />
      )}
    </div>
  );
};

export default SupervisorDashboard;
