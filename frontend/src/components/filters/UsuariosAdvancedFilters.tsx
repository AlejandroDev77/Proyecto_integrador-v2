import React, { useEffect, useState } from 'react';
import AdvancedFilters from '../filters/AdvancedFilters';
import { Rol } from '../../types/rol';
import { getRoles } from '../../services/rolService';

interface UsuariosFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  roles?: Rol[];
}

export const UsuariosAdvancedFilters: React.FC<UsuariosFiltersProps> = ({
  onFiltersChange,
  roles = [],
}) => {
  const [rolesList, setRolesList] = useState<Rol[]>(roles);

  // Cargar roles disponibles al montar
  useEffect(() => {
    if (rolesList.length === 0) {
      const fetchRolesData = async () => {
        try {
          const data = await getRoles(1, 100);
          setRolesList(data.data || data.content || data || []);
        } catch (error) {
          console.error('Error al cargar roles:', error);
        }
      };
      fetchRolesData();
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
