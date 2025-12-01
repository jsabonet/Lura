'use client';

import React, { useState } from 'react';

// Tipos para os dados da tabela
interface LuraTableColumn {
  key: string;
  label: string;
  icon?: React.ReactNode;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface LuraTableProps {
  columns: LuraTableColumn[];
  data: any[];
  title?: string;
  searchPlaceholder?: string;
  filters?: { label: string; value: string; icon?: React.ReactNode }[];
  itemsPerPage?: number;
  showPagination?: boolean;
  isLoading?: boolean;
}

// Componente de skeleton loader
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="lura-table-skeleton">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="lura-table-skeleton-row">
        <div className="lura-table-skeleton-cell" style={{ width: '25%' }} />
        <div className="lura-table-skeleton-cell" style={{ width: '20%' }} />
        <div className="lura-table-skeleton-cell" style={{ width: '30%' }} />
        <div className="lura-table-skeleton-cell" style={{ width: '25%' }} />
      </div>
    ))}
  </div>
);

// Componente principal da tabela Lura
export default function LuraTable({
  columns,
  data,
  title,
  searchPlaceholder = 'Buscar...',
  filters = [],
  itemsPerPage = 10,
  showPagination = true,
  isLoading = false,
}: LuraTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filtrar dados baseado na busca
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Ordenar dados
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal === bVal) return 0;
    const comparison = aVal > bVal ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginação
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Manipular ordenação
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className="lura-table-wrapper">
      {/* Cabeçalho com busca e filtros */}
      <div className="lura-table-header">
        {title && (
          <h3 className="text-2xl font-bold text-[#1A5632] mb-2">{title}</h3>
        )}

        {/* Barra de busca */}
        <div className="lura-table-search">
          <span className="lura-table-search-icon">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filtros */}
        {filters.length > 0 && (
          <div className="lura-table-filters">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={`lura-filter-btn ${
                  activeFilter === filter.value ? 'active' : ''
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === filter.value ? null : filter.value
                  )
                }
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabela */}
      {isLoading ? (
        <TableSkeleton rows={itemsPerPage} />
      ) : paginatedData.length === 0 ? (
        <div className="lura-table-empty">
          <div className="lura-table-empty-icon">📊</div>
          <div className="lura-table-empty-text">Nenhum dado encontrado</div>
          <div className="lura-table-empty-subtext">
            Tente ajustar os filtros ou a busca
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="lura-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() =>
                        column.sortable && handleSort(column.key)
                      }
                      className={column.sortable ? 'cursor-pointer' : ''}
                    >
                      <div className="flex items-center gap-2">
                        {column.icon}
                        {column.label}
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key} data-label={column.label}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {showPagination && totalPages > 1 && (
            <div className="lura-pagination">
              <button
                className="lura-pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
                Anterior
              </button>

              <div className="lura-pagination-info">
                Página {currentPage} de {totalPages}
              </div>

              <button
                className="lura-pagination-btn"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
                <svg width="16" height="16" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 18l6-6-6-6"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Componentes auxiliares exportados

// Badge para status
export const LuraBadge = ({
  type,
  children,
}: {
  type: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}) => <span className={`lura-badge ${type}`}>{children}</span>;

// Mini gráfico
export const LuraMiniChart = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="lura-mini-chart">
    <div className="lura-mini-chart-value">{value}</div>
    <div className="lura-mini-chart-label">{label}</div>
  </div>
);

// Indicador de tendência
export const LuraTrend = ({
  type,
  value,
}: {
  type: 'up' | 'down' | 'neutral';
  value: string | number;
}) => <span className={`lura-trend-${type}`}>{value}</span>;

// Célula com ícone
export const LuraIconCell = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="lura-table-cell-icon">
    <span className="lura-table-icon">{icon}</span>
    {children}
  </div>
);

// Ações rápidas
export const LuraTableActions = ({
  onEdit,
  onDelete,
  onView,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) => (
  <div className="lura-table-actions">
    {onView && (
      <button className="lura-action-btn" onClick={onView} title="Visualizar">
        <svg width="18" height="18" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>
    )}
    {onEdit && (
      <button className="lura-action-btn" onClick={onEdit} title="Editar">
        <svg width="18" height="18" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    )}
    {onDelete && (
      <button className="lura-action-btn" onClick={onDelete} title="Excluir">
        <svg width="18" height="18" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    )}
  </div>
);
