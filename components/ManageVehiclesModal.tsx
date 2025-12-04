
import React, { useState } from 'react';
import { Vehicle } from '../types';
import { TrashIcon, XIcon, AlertIcon } from './icons/Icons';

interface ManageVehiclesModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onDeleteVehicle: (vehicleId: string) => void;
}

const ManageVehiclesModal: React.FC<ManageVehiclesModalProps> = ({ vehicles, onClose, onAddVehicle, onDeleteVehicle }) => {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [error, setError] = useState('');
  const [vehicleToConfirmDelete, setVehicleToConfirmDelete] = useState<Vehicle | null>(null);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !model || !brand || !year) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    setError('');
    onAddVehicle({ plate: plate.toUpperCase(), model, brand, year: Number(year) });
    setPlate('');
    setModel('');
    setBrand('');
    setYear(new Date().getFullYear());
  };

  const handleDelete = (vehicle: Vehicle) => {
    onDeleteVehicle(vehicle.id);
    setVehicleToConfirmDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border-t-4 border-green-600" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Gerenciar Frota de Veículos</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-6 w-6" />
            </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Add Vehicle Form */}
          <div className="border-b pb-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Cadastrar Novo Veículo</h4>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-1">
                <label htmlFor="plate" className="block text-sm font-medium text-gray-700">Placa</label>
                <input type="text" id="plate" value={plate} onChange={e => setPlate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div className="lg:col-span-1">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                <input type="text" id="brand" value={brand} onChange={e => setBrand(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                <input type="text" id="model" value={model} onChange={e => setModel(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div className="lg:col-span-1">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Ano</label>
                <input type="number" id="year" value={year} onChange={e => setYear(e.target.value ? parseInt(e.target.value) : '')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" required />
              </div>
              <button type="submit" className="w-full lg:col-span-5 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                Adicionar Veículo
              </button>
            </form>
          </div>

          {/* Vehicle List */}
          <div>
             <h4 className="text-lg font-semibold text-gray-700 mb-4">Veículos Cadastrados</h4>
             <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {vehicles.length > 0 ? vehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <div>
                            <p className="font-semibold text-gray-800">{vehicle.plate}</p>
                            <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model} - {vehicle.year}</p>
                        </div>
                        <button onClick={() => setVehicleToConfirmDelete(vehicle)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                            <TrashIcon className="h-5 w-5"/>
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-4">Nenhum veículo cadastrado.</p>
                )}
             </div>
          </div>
        </div>

      </div>

        {/* Confirmation Modal */}
        {vehicleToConfirmDelete && (
             <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-60" onClick={(e) => e.stopPropagation()}>
                <div className="bg-white p-8 rounded-lg shadow-2xl border text-center max-w-md">
                    <AlertIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-gray-900">Confirmar Exclusão</h4>
                    <p className="my-2 text-gray-600">
                        Você tem certeza que deseja excluir o veículo <span className="font-bold">{vehicleToConfirmDelete.plate}</span>? Esta ação não pode ser desfeita.
                    </p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={() => setVehicleToConfirmDelete(null)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button onClick={() => handleDelete(vehicleToConfirmDelete)} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Excluir
                        </button>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};

export default ManageVehiclesModal;
