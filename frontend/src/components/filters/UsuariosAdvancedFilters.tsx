import React, { useEffect, useState } from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';
import axios from 'axios';

interface UsuariosFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  roles?: { id_rol: number; nom_rol: string }[];
}

export const UsuariosAdvancedFilters: React.FC<UsuariosFiltersProps> = ({
  onFiltersChange,
  roles = [],
}) => {
  const [rolesList, setRolesList] = useState<{ id_rol: number; nom_rol: string }[]>(roles);

  // Cargar roles disponibles al montar
  useEffect(() => {
    if (rolesList.length === 0) {
      const fetchRoles = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/roles');
          setRolesList(response.data.data || response.data);
        } catch (error) {
          console.error('Error al cargar roles:', error);
        }
      };
      fetchRoles();
    }
  }, []);

  const filterFields = [
    {
      id: 'cod_usu',
      label: 'Código',
      type: 'text' as const,
      placeholder: 'Ej: USU-1',
    },
    {
      id: 'nom_usu',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Juan',
    },
    {
      id: 'email_usu',
      label: 'Email',
      type: 'text' as const,
      placeholder: 'Ej: juan@example.com',
    },
    {
      id: 'nom_rol',
      label: 'Rol',
      type: 'select' as const,
      options: Array.from(
        new Map(rolesList.map((r) => [r.nom_rol, { value: r.nom_rol, label: r.nom_rol }])).values()
      ),
    },
    {
      id: 'est_usu',
      label: 'Estado',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
      ],
    },
  ];

  const handleFiltersChange = (filters: Record<string, any>) => {
    onFiltersChange(filters);
  };

  return (
    <div className="space-y-4">
      <AdvancedFilters
        fields={filterFields}
        onFiltersChange={handleFiltersChange}
        onReset={() => onFiltersChange({})}
      />
    </div>
  );
};

export default UsuariosAdvancedFilters;
