import { Chart } from 'react-charts';
import { useRealtimeData } from '../../hooks/useSalesData';
import { fetchMetrics } from '../../services/salesService';

export default function TeamChart(){

  const { data: metrics, loading, error } = useRealtimeData(fetchMetrics);
  
  // Ensure metrics is always an array
  const metricsData = Array.isArray(metrics) ? metrics : [];

  const chartData = [
    {
      data: metricsData.map((m) => ({
        primary: m.name,
        secondary: m.sum,
      })),
    },
  ];

  const primaryAxis = {
    getValue: (d) => d.primary,
    scaleType: 'band',
    padding: 0.2,
    position: 'bottom',
  };

  function y_max() {
    if (metricsData.length > 0) {
      const maxSum = Math.max(...metricsData.map((m) => m.sum));
      return maxSum + 2000;
    };
    return 5000;
  };

  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: 'linear',
      min: 0,
      max: y_max(),
      padding: {
        top: 20,
        bottom: 40,
      },
    },
  ];
    return(
    <div
        className="db-card chart-container"
        role="region"
        aria-label="Devis envoyés"
      >
        <h2>Devis signés par l'équipe (€)</h2>
        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: 'red' }}>Erreur lors du chargement des données</p>}
        {!loading && !error && (
          <div style={{ flex: 1 }}>
            <Chart
              options={{
                data: chartData,
                primaryAxis,
                secondaryAxes,
                type: 'bar',
                defaultColors: ['#58d675'],
                tooltip: {
                  show: false,
                },
              }}
            />
          </div>
        )}
      </div>
      )
}