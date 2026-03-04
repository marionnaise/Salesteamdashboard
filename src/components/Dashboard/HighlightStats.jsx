import { useAuth } from '../../context/AuthContext';
import { useRealtimeData } from '../../hooks/useSalesData';
import { fetchSalesStats } from '../../services/salesService';

export default function HighlightStats(){
    const { session } = useAuth();
    const { data: stats, loading, error } = useRealtimeData(fetchSalesStats);

    if (loading) {
        return (
            <div className="highlights-container">
                <p>Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="highlights-container">
                <h1>Highlights</h1>
                <p style={{ color: 'red' }}>Erreur lors du chargement des données</p>
            </div>
        );
    }

    return(
        <div className="highlights-container">
                {/* Best Salesperson */}
                <div className="stat-card">
                    <div className="stat-label">🏆 Top vendeur</div>
                    <div className="stat-value">
                        {stats?.bestSalesperson?.name || 'N/A'}
                    </div>
                    <div className="stat-subtext">
                        {stats?.bestSalesperson?.total 
                            ? `${(stats.bestSalesperson.total / 1000).toFixed(1)}k€` 
                            : 'Pas de données'}
                    </div>
                </div>

                {/* Total Sales */}
                <div className="stat-card">
                    <div className="stat-label">💰 Montant total devis</div>
                    <div className="stat-value">
                        {stats?.totalSales 
                            ? `${(stats.totalSales / 1000).toFixed(1)}k€` 
                            : '0€'}
                    </div>
                    <div className="stat-subtext">Montant cumulé</div>
                </div>

                {/* Objective Percentage */}
                <div className="stat-card">
                    <div className="stat-label">🎯 Objectif (30k€)</div>
                    <div className="stat-value">
                        {stats?.objectivePercentage || 0}%
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ 
                                width: `${Math.min(stats?.objectivePercentage || 0, 100)}%`,
                                backgroundColor: stats?.objectivePercentage >= 100 ? '#58d675' : '#4a90e2'
                            }}
                        />
                    </div>
                </div>
        </div>
    )
}