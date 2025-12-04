
import React, { useState, useCallback } from 'react';
import { Vehicle, Checklist, ChecklistItem, ChecklistItemStatus } from '../types';
import { CameraIcon, TrashIcon } from './icons/Icons';

interface ChecklistFormProps {
  vehicles: Vehicle[];
  onSubmit: (checklist: Omit<Checklist, 'id' | 'timestamp'>) => void;
}

const initialChecklistItems: ChecklistItem[] = [
  { id: 'exterior', label: 'Condição externa (lataria, vidros, faróis)', status: 'PENDING' },
  { id: 'interior', label: 'Condição interna (bancos, painel, limpeza)', status: 'PENDING' },
  { id: 'fuel', label: 'Nível de combustível (acima de 1/4)', status: 'PENDING' },
  { id: 'tires', label: 'Calibragem e estado dos pneus', status: 'PENDING' },
  { id: 'equipment', label: 'Equipamentos obrigatórios (triângulo, macaco)', status: 'PENDING' },
];

const ChecklistForm: React.FC<ChecklistFormProps> = ({ vehicles, onSubmit }) => {
  const [responsibleName, setResponsibleName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState(vehicles.length > 0 ? vehicles[0].plate : '');
  const [mileage, setMileage] = useState('');
  const [returnMileage, setReturnMileage] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(JSON.parse(JSON.stringify(initialChecklistItems)));
  const [photos, setPhotos] = useState<string[]>([]);
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleItemStatusChange = (id: string, status: ChecklistItemStatus) => {
    setChecklistItems(
      checklistItems.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            setPhotos((prev) => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
  
  const resetForm = useCallback(() => {
    setResponsibleName('');
    setVehiclePlate(vehicles.length > 0 ? vehicles[0].plate : '');
    setMileage('');
    setReturnMileage('');
    setChecklistItems(JSON.parse(JSON.stringify(initialChecklistItems)));
    setPhotos([]);
    setObservations('');
    setError('');
  }, [vehicles]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!responsibleName || !vehiclePlate || !mileage) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (checklistItems.some(item => item.status === 'PENDING')) {
      setError('Por favor, marque todos os itens do checklist.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    setTimeout(() => {
      const data: Omit<Checklist, 'id' | 'timestamp'> = {
        responsibleName,
        vehiclePlate,
        mileage: Number(mileage),
        checklistItems,
        photos,
        observations,
      };
      if (returnMileage) {
          data.returnMileage = Number(returnMileage);
      }
      onSubmit(data);
      setIsSubmitting(false);
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-2xl border-t-4 border-green-600">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Formulário de Inspeção</h2>
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4" role="alert">
          <p className="font-bold">Sucesso!</p>
          <p>Checklist enviado com sucesso.</p>
        </div>
      )}
       {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4" role="alert">
          <p className="font-bold">Erro!</p>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700">Nome do Responsável</label>
          <input type="text" id="responsibleName" value={responsibleName} onChange={(e) => setResponsibleName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-shadow duration-200" required />
        </div>
        <div>
            <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-700">Placa do Veículo</label>
            <select id="vehiclePlate" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-shadow duration-200" required>
            {vehicles.map(v => <option key={v.id} value={v.plate}>{v.plate} - {v.model}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Quilometragem de Retirada (km)</label>
              <input type="number" id="mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-shadow duration-200" required />
            </div>
            <div>
              <label htmlFor="returnMileage" className="block text-sm font-medium text-gray-700">Quilometragem de Devolução (km)</label>
              <input type="number" id="returnMileage" value={returnMileage} onChange={(e) => setReturnMileage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-shadow duration-200" />
            </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Itens de Inspeção</h3>
          <div className="space-y-4">
            {checklistItems.map(item => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800 mb-2">{item.label}</p>
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => handleItemStatusChange(item.id, 'OK')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${item.status === 'OK' ? 'bg-green-500 text-white font-semibold shadow' : 'bg-gray-200 text-gray-700 hover:bg-green-200'}`}>OK</button>
                    <button type="button" onClick={() => handleItemStatusChange(item.id, 'NOT_OK')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${item.status === 'NOT_OK' ? 'bg-red-500 text-white font-semibold shadow' : 'bg-gray-200 text-gray-700 hover:bg-red-200'}`}>Não OK</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotos (Opcional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <CameraIcon className="mx-auto h-12 w-12 text-gray-400"/>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                            <span>Carregar arquivos</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
            </div>
            {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img src={photo} alt={`Foto ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                            <button onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea id="observations" value={observations} onChange={(e) => setObservations(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition-shadow duration-200" />
        </div>
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200">
            {isSubmitting ? 'Enviando...' : 'Enviar Checklist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChecklistForm;
