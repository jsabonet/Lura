import LuraTable, {
  LuraBadge,
  LuraMiniChart,
  LuraTrend,
  LuraIconCell,
  LuraTableActions,
} from '@/components/LuraTable';

// Exemplo 1: Tabela de Preços de Produtos Agrícolas
export function TabelaPrecosAgricolas() {
  const columns = [
    {
      key: 'produto',
      label: 'Produto',
      sortable: true,
      icon: (
        <svg width="16" height="16" fill="currentColor">
          <path d="M12 2l2 7h5l-4 4 1.5 6L12 15l-4.5 4L9 13 5 9h5l2-7z" />
        </svg>
      ),
    },
    {
      key: 'preco',
      label: 'Preço/kg',
      sortable: true,
      render: (value: number) => `R$ ${value.toFixed(2)}`,
    },
    {
      key: 'variacao',
      label: 'Variação',
      sortable: true,
      render: (value: number) => {
        const type = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
        return <LuraTrend type={type} value={`${value > 0 ? '+' : ''}${value}%`} />;
      },
    },
    {
      key: 'regiao',
      label: 'Região',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Disponibilidade',
      render: (value: string) => {
        const types: any = {
          disponivel: 'success',
          limitado: 'warning',
          indisponivel: 'danger',
        };
        return <LuraBadge type={types[value]}>{value.toUpperCase()}</LuraBadge>;
      },
    },
  ];

  const data = [
    {
      produto: 'Milho',
      preco: 85.5,
      variacao: 5.2,
      regiao: 'Centro-Oeste',
      status: 'disponivel',
    },
    {
      produto: 'Soja',
      preco: 145.8,
      variacao: -2.1,
      regiao: 'Sul',
      status: 'disponivel',
    },
    {
      produto: 'Café Arábica',
      preco: 1250.0,
      variacao: 12.5,
      regiao: 'Sudeste',
      status: 'limitado',
    },
    {
      produto: 'Trigo',
      preco: 95.3,
      variacao: 0.8,
      regiao: 'Sul',
      status: 'disponivel',
    },
    {
      produto: 'Feijão',
      preco: 280.0,
      variacao: -5.4,
      regiao: 'Nordeste',
      status: 'disponivel',
    },
  ];

  const filters = [
    {
      label: 'Disponível',
      value: 'disponivel',
      icon: '✓',
    },
    {
      label: 'Alta de preço',
      value: 'alta',
      icon: '↑',
    },
    {
      label: 'Baixa de preço',
      value: 'baixa',
      icon: '↓',
    },
  ];

  return (
    <LuraTable
      title="Preços de Produtos Agrícolas"
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por produto ou região..."
      filters={filters}
      itemsPerPage={10}
      showPagination={true}
    />
  );
}

// Exemplo 2: Tabela de Previsão Climática
export function TabelaPrevisaoClimatica() {
  const columns = [
    {
      key: 'data',
      label: 'Data',
      sortable: true,
    },
    {
      key: 'temperatura',
      label: 'Temperatura',
      render: (_: any, row: any) => (
        <LuraIconCell
          icon={
            <svg width="20" height="20" fill="currentColor">
              <path d="M10 2a4 4 0 014 4v6a6 6 0 11-8 0V6a4 4 0 014-4zm0 2a2 2 0 00-2 2v6.17a4 4 0 104 0V6a2 2 0 00-2-2z" />
            </svg>
          }
        >
          {row.temperatura}°C
        </LuraIconCell>
      ),
    },
    {
      key: 'umidade',
      label: 'Umidade',
      render: (value: number) => <LuraMiniChart value={`${value}%`} label="Umidade" />,
    },
    {
      key: 'precipitacao',
      label: 'Chuva',
      render: (value: number) => (
        <LuraIconCell
          icon={
            <svg width="20" height="20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
          }
        >
          {value}mm
        </LuraIconCell>
      ),
    },
    {
      key: 'recomendacao',
      label: 'Recomendação',
      render: (value: string) => {
        const types: any = {
          'Ideal para plantio': 'success',
          'Atenção': 'warning',
          'Não recomendado': 'danger',
          'Monitorar': 'info',
        };
        return <LuraBadge type={types[value]}>{value}</LuraBadge>;
      },
    },
  ];

  const data = [
    {
      data: '05/11/2025',
      temperatura: 28,
      umidade: 65,
      precipitacao: 0,
      recomendacao: 'Ideal para plantio',
    },
    {
      data: '06/11/2025',
      temperatura: 30,
      umidade: 70,
      precipitacao: 5,
      recomendacao: 'Ideal para plantio',
    },
    {
      data: '07/11/2025',
      temperatura: 26,
      umidade: 80,
      precipitacao: 25,
      recomendacao: 'Atenção',
    },
    {
      data: '08/11/2025',
      temperatura: 24,
      umidade: 85,
      precipitacao: 45,
      recomendacao: 'Não recomendado',
    },
    {
      data: '09/11/2025',
      temperatura: 27,
      umidade: 75,
      precipitacao: 10,
      recomendacao: 'Monitorar',
    },
  ];

  return (
    <LuraTable
      title="Previsão Climática - Próximos 5 Dias"
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por data..."
      showPagination={false}
    />
  );
}

// Exemplo 3: Tabela de Dados de Sensores IoT
export function TabelaSensoresIoT() {
  const columns = [
    {
      key: 'sensor',
      label: 'Sensor',
      sortable: true,
    },
    {
      key: 'localizacao',
      label: 'Localização',
      sortable: true,
    },
    {
      key: 'leitura',
      label: 'Última Leitura',
      render: (value: number, row: any) => (
        <LuraMiniChart value={value} label={row.unidade} />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const types: any = {
          ativo: 'success',
          alerta: 'warning',
          offline: 'danger',
        };
        return <LuraBadge type={types[value]}>{value.toUpperCase()}</LuraBadge>;
      },
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (_: any, row: any) => (
        <LuraTableActions
          onView={() => console.log('Ver', row.sensor)}
          onEdit={() => console.log('Editar', row.sensor)}
          onDelete={() => console.log('Excluir', row.sensor)}
        />
      ),
    },
  ];

  const data = [
    {
      sensor: 'Sensor Umidade Solo #001',
      localizacao: 'Talhão A - Setor 1',
      leitura: 45,
      unidade: '%',
      status: 'ativo',
    },
    {
      sensor: 'Sensor Temperatura #002',
      localizacao: 'Talhão B - Setor 2',
      leitura: 28,
      unidade: '°C',
      status: 'ativo',
    },
    {
      sensor: 'Sensor pH Solo #003',
      localizacao: 'Talhão C - Setor 1',
      leitura: 6.5,
      unidade: 'pH',
      status: 'alerta',
    },
    {
      sensor: 'Sensor Nutrientes #004',
      localizacao: 'Talhão A - Setor 3',
      leitura: 320,
      unidade: 'ppm',
      status: 'ativo',
    },
    {
      sensor: 'Sensor Pressão Atm #005',
      localizacao: 'Estação Central',
      leitura: 1013,
      unidade: 'hPa',
      status: 'offline',
    },
  ];

  const filters = [
    {
      label: 'Ativos',
      value: 'ativo',
      icon: '●',
    },
    {
      label: 'Em Alerta',
      value: 'alerta',
      icon: '⚠',
    },
    {
      label: 'Offline',
      value: 'offline',
      icon: '○',
    },
  ];

  return (
    <LuraTable
      title="Monitoramento de Sensores IoT"
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por sensor ou localização..."
      filters={filters}
      itemsPerPage={5}
      showPagination={true}
    />
  );
}

// Exemplo 4: Tabela de Tendências de Mercado
export function TabelaTendenciasMercado() {
  const columns = [
    {
      key: 'categoria',
      label: 'Categoria',
      sortable: true,
    },
    {
      key: 'demanda',
      label: 'Demanda',
      render: (value: string) => {
        const types: any = {
          Alta: 'success',
          Média: 'info',
          Baixa: 'warning',
        };
        return <LuraBadge type={types[value]}>{value}</LuraBadge>;
      },
    },
    {
      key: 'tendencia30d',
      label: 'Tendência 30d',
      sortable: true,
      render: (value: number) => {
        const type = value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';
        return <LuraTrend type={type} value={`${value > 0 ? '+' : ''}${value}%`} />;
      },
    },
    {
      key: 'projecao',
      label: 'Projeção 90d',
      render: (value: string) => {
        const types: any = {
          Crescimento: 'success',
          Estável: 'info',
          Declínio: 'danger',
        };
        return <LuraBadge type={types[value]}>{value}</LuraBadge>;
      },
    },
  ];

  const data = [
    {
      categoria: 'Grãos',
      demanda: 'Alta',
      tendencia30d: 8.5,
      projecao: 'Crescimento',
    },
    {
      categoria: 'Hortaliças',
      demanda: 'Média',
      tendencia30d: 2.1,
      projecao: 'Estável',
    },
    {
      categoria: 'Frutas',
      demanda: 'Alta',
      tendencia30d: 15.3,
      projecao: 'Crescimento',
    },
    {
      categoria: 'Lácteos',
      demanda: 'Média',
      tendencia30d: -3.2,
      projecao: 'Declínio',
    },
    {
      categoria: 'Proteína Animal',
      demanda: 'Alta',
      tendencia30d: 6.7,
      projecao: 'Crescimento',
    },
  ];

  return (
    <LuraTable
      title="Tendências de Mercado Agrícola"
      columns={columns}
      data={data}
      searchPlaceholder="Buscar por categoria..."
      showPagination={false}
    />
  );
}

// Exemplo com loading state
export function TabelaComCarregamento() {
  return (
    <LuraTable
      title="Carregando dados..."
      columns={[
        { key: 'col1', label: 'Coluna 1' },
        { key: 'col2', label: 'Coluna 2' },
      ]}
      data={[]}
      isLoading={true}
    />
  );
}
