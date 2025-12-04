
import React from 'react';
import { Checklist } from '../types';
import { AlertIcon, CheckCircleIcon, XIcon } from './icons/Icons';

interface ChecklistDetailModalProps {
  checklist: Checklist;
  onClose: () => void;
}

const ChecklistDetailModal: React.FC<ChecklistDetailModalProps> = ({ checklist, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-t-4 border-green-600" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Detalhes do Checklist</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-semibold text-gray-600">Funcionário</p>
                    <p className="text-gray-900">{checklist.responsibleName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-semibold text-gray-600">Data e Hora</p>
                    <p className="text-gray-900">{new Date(checklist.timestamp).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-semibold text-gray-600">Veículo (Placa)</p>
                    <p className="text-gray-900">{checklist.vehiclePlate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-semibold text-gray-600">Quilometragem de Retirada</p>
                    <p className="text-gray-900">{checklist.mileage.toLocaleString('pt-BR')} km</p>
                </div>
                {checklist.returnMileage && (
                     <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold text-gray-600">Quilometragem de Devolução</p>
                        <p className="text-gray-900">{checklist.returnMileage.toLocaleString('pt-BR')} km</p>
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-semibold text-gray-700 mb-2">Itens Verificados</h4>
                <ul className="space-y-2">
                    {checklist.checklistItems.map(item => (
                        <li key={item.id} className="flex items-center justify-between p-3 rounded-md border">
                            <span className="text-gray-700">{item.label}</span>
                            {item.status === 'OK' ? (
                                <span className="flex items-center text-green-600 font-semibold"><CheckCircleIcon className="h-5 w-5 mr-1"/> OK</span>
                            ) : (
                                <span className="flex items-center text-red-600 font-semibold"><AlertIcon className="h-5 w-5 mr-1"/> Não OK</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            
            {checklist.observations && (
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Observações</h4>
                    <p className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">{checklist.observations}</p>
                </div>
            )}

            {checklist.photos.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Fotos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {checklist.photos.map((photo, index) => (
                            <a href={photo} target="_blank" rel="noopener noreferrer" key={index}>
                                <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded-md shadow-sm hover:shadow-lg transition-shadow"/>
                            </a>
                        ))}
                    </div>
                </div>
            )}

             <div className="pt-4 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                    Fechar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistDetailModal;
