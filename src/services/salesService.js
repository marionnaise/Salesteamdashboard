import supabase from '../supabase-client';

// Fetch aggregated metrics (sum of deals) grouped by salesperson
export async function fetchMetrics() {
  try {
    const { data, error } = await supabase
      .from('sales_deals')
      .select(
        `
        value.sum(),
        ...user_profiles!inner(
          name
        )
        `
      );
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching metrics:', error.message);
    throw error;
  }
}

//Fetch total sales sum
export async function fetchTotalSales() {
  try {
    const { data, error } = await supabase
      .from('sales_deals')
      .select('value');
    if (error) throw error;
    
    const total = data.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return total;
  } catch (error) {
    console.error('Error fetching total sales:', error.message);
    throw error;
  }
}

//Fetch best salesperson (highest total sales)
export async function fetchBestSalesperson() {
  try {
    const { data, error } = await supabase
      .from('sales_deals')
      .select(
        `
        value,
        user_profiles!inner(
          id,
          name
        )
        `
      );
    if (error) throw error;

    // Aggregate by salesperson
    const salesByPerson = {};
    data.forEach((deal) => {
      const name = deal.user_profiles?.name;
      const id = deal.user_profiles?.id;
      if (name) {
        if (!salesByPerson[name]) {
          salesByPerson[name] = { id, total: 0 };
        }
        salesByPerson[name].total += deal.value || 0;
      }
    });

    // Find best salesperson
    let bestSalesperson = null;
    let maxSales = 0;
    for (const [name, { id, total }] of Object.entries(salesByPerson)) {
      if (total > maxSales) {
        maxSales = total;
        bestSalesperson = { name, id, total };
      }
    }

    return bestSalesperson;
  } catch (error) {
    console.error('Error fetching best salesperson:', error.message);
    throw error;
  }
}

//Fetch sales statistics for highlights
// Returns: { bestSalesperson, totalSales, objectivePercentage }
export async function fetchSalesStats() {
  try {
    const [metrics, bestSalesperson, totalSales] = await Promise.all([
      fetchMetrics(),
      fetchBestSalesperson(),
      fetchTotalSales(),
    ]);

    const SALES_OBJECTIVE = 30000;
    const objectivePercentage = (totalSales / SALES_OBJECTIVE) * 100;

    return {
      bestSalesperson,
      totalSales,
      objectivePercentage: Math.round(objectivePercentage),
    };
  } catch (error) {
    console.error('Error fetching sales stats:', error.message);
    throw error;
  }
}

/**
 * Subscribe to real-time changes in sales_deals table
 */
// simple in-memory event emitter for manual notifications
const salesChangeListeners = [];

export function onSalesChange(listener) {
  salesChangeListeners.push(listener);
  // return unsubscribe function
  return () => {
    const idx = salesChangeListeners.indexOf(listener);
    if (idx !== -1) salesChangeListeners.splice(idx, 1);
  };
}

export function notifySalesChange() {
  salesChangeListeners.forEach((l) => {
    try {
      l();
    } catch (err) {
      console.error('Error in sales change listener', err);
    }
  });
}

export function subscribeToSalesChanges(callback) {
  const channel = supabase
    .channel('deal-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sales_deals',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return channel;
}
