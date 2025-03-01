import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface MenuItemSales {
  menuItemId: string;
  name: string;
  count: number;
  revenue: number;
}

export interface TimeDistribution {
  hour: number;
  count: number;
  revenue: number;
}

export interface DayDistribution {
  day: string;
  count: number;
  revenue: number;
}

export interface SalesPerformanceReport {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  revenueByPeriod: {
    daily: { date: string; revenue: number }[];
    weekly: { week: string; revenue: number }[];
    monthly: { month: string; revenue: number }[];
  };
  popularItems: MenuItemSales[];
  peakTimes: {
    byHour: TimeDistribution[];
    byDay: DayDistribution[];
  };
}

interface UseGetSalesPerformanceOptions {
  restaurantId: string;
  startDate?: Date;
  endDate?: Date;
  period?: 'daily' | 'weekly' | 'monthly';
}

export const useGetSalesPerformance = ({
  restaurantId,
  startDate,
  endDate,
  period = 'daily',
}: UseGetSalesPerformanceOptions) => {
  const { getAccessTokenSilently } = useAuth0();

  const getSalesPerformanceRequest = async (): Promise<SalesPerformanceReport> => {
    const accessToken = await getAccessTokenSilently();

    // Create query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    if (period) params.append('period', period);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/my/restaurant/${restaurantId}/reports/sales?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sales performance data:', error);
      toast.error('Failed to load sales data');
      throw new Error('Failed to fetch sales performance data');
    }
  };

  const { data, isLoading, isError, refetch } = useQuery(
    ['salesPerformance', restaurantId, startDate, endDate, period],
    getSalesPerformanceRequest,
    {
      refetchOnWindowFocus: false,
      enabled: !!restaurantId,
    }
  );

  return {
    salesData: data,
    isLoading,
    isError,
    refetch,
  };
};
