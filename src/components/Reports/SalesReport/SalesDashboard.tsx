import { useState } from 'react';
import { useGetSalesPerformance } from '@/api/salesPerformanceApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Loader2,
  FileSpreadsheet,
  FileDown,
} from 'lucide-react';
import { subDays, format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { DatePickerWithRange } from './DatePickerWithange';

// Define the date range picker input type
interface DateRangePickerInputs {
  from: Date;
  to: Date;
}

type PeriodT = 'daily' | 'weekly' | 'monthly';

const SalesDashboard = ({ restaurant }: { restaurant?: Restaurant }) => {
  // Set default date range (last 30 days)
  const [dateRange, setDateRange] = useState<DateRangePickerInputs>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [periodType, setPeriodType] = useState<PeriodT>('daily');
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  const { salesData, isLoading, isError } = useGetSalesPerformance({
    restaurantId: restaurant?._id ?? '',
    startDate: dateRange.from,
    endDate: dateRange.to,
    period: periodType,
  });

  if (!restaurant) {
    return <div>Please create a restaurant to view sales data</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Failed to load sales data. Please try again later.</p>
      </div>
    );
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Time of day label formatter
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Get a clean filename
  const getCleanFilename = () => {
    const restaurantName = restaurant?.restaurantName
      ? restaurant.restaurantName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      : 'restaurant';
    const fromDate = format(dateRange.from, 'yyyy-MM-dd');
    const toDate = format(dateRange.to, 'yyyy-MM-dd');
    return `${restaurantName}_sales_report_${fromDate}_to_${toDate}`;
  };

  // Export to Excel
  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const workbook = XLSX.utils.book_new();

      // Summary worksheet
      const summaryData = [
        ['Total Revenue', formatCurrency(salesData?.summary.totalRevenue || 0)],
        ['Total Orders', salesData?.summary.totalOrders || 0],
        ['Average Order Value', formatCurrency(salesData?.summary.averageOrderValue || 0)],
      ];
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');

      // Revenue by period worksheet
      const periodData = salesData?.revenueByPeriod[periodType] || [];
      const periodHeader =
        periodType === 'daily'
          ? ['Date', 'Revenue']
          : periodType === 'weekly'
            ? ['Week', 'Revenue']
            : ['Month', 'Revenue'];

      const periodRows = periodData.map((item) => {
        const key = periodType === 'daily' ? 'date' : periodType === 'weekly' ? 'week' : 'month';
        // @ts-expect-error need to fix it later
        return [item?.[key], item.revenue];
      });

      const periodWs = XLSX.utils.aoa_to_sheet([periodHeader, ...periodRows]);
      XLSX.utils.book_append_sheet(workbook, periodWs, 'Revenue By Period');

      // Popular items worksheet
      const popularItemsHeader = ['Item Name', 'Order Count', 'Revenue'];
      const popularItemsRows =
        salesData?.popularItems.map((item) => [item.name, item.count, item.revenue]) || [];

      const popularItemsWs = XLSX.utils.aoa_to_sheet([popularItemsHeader, ...popularItemsRows]);
      XLSX.utils.book_append_sheet(workbook, popularItemsWs, 'Popular Items');

      // Peak times - By hour worksheet
      const byHourHeader = ['Hour', 'Order Count', 'Revenue'];
      const byHourRows =
        salesData?.peakTimes.byHour.map((item) => [
          formatHour(item.hour),
          item.count,
          item.revenue,
        ]) || [];

      const byHourWs = XLSX.utils.aoa_to_sheet([byHourHeader, ...byHourRows]);
      XLSX.utils.book_append_sheet(workbook, byHourWs, 'Orders By Hour');

      // Peak times - By day worksheet
      const byDayHeader = ['Day', 'Order Count', 'Revenue'];
      const byDayRows =
        salesData?.peakTimes.byDay.map((item) => [item.day, item.count, item.revenue]) || [];

      const byDayWs = XLSX.utils.aoa_to_sheet([byDayHeader, ...byDayRows]);
      XLSX.utils.book_append_sheet(workbook, byDayWs, 'Orders By Day');

      // Generate filename and save
      const filename = `${getCleanFilename()}.xlsx`;
      XLSX.writeFile(workbook, filename);
      toast.success('Excel report exported successfully');
    } catch (error) {
      console.error('Failed to export Excel file:', error);
      toast.error('Failed to export Excel file');
    } finally {
      setExportLoading(false);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    setExportLoading(true);

    // Import jsPDF dynamically to avoid server-side rendering issues
    import('jspdf')
      .then(async ({ default: jsPDF }) => {
        try {
          // Import jspdf-autotable dynamically
          const autoTable = (await import('jspdf-autotable')).default;

          // Create a new PDF document
          const doc = new jsPDF();
          const dateRangeStr = `${format(dateRange.from, 'MMM dd, yyyy')} to ${format(dateRange.to, 'MMM dd, yyyy')}`;

          // Add title and restaurant info
          doc.setFontSize(18);
          doc.text(`Sales Report - ${restaurant?.restaurantName || 'Restaurant'}`, 14, 20);
          doc.setFontSize(12);
          doc.text(`Period: ${dateRangeStr}`, 14, 30);
          doc.text(
            `Report Type: ${periodType.charAt(0).toUpperCase() + periodType.slice(1)}`,
            14,
            40
          );

          // Add summary section
          doc.setFontSize(14);
          doc.text('Summary', 14, 55);

          const summaryData = [
            ['Metric', 'Value'],
            ['Total Revenue', formatCurrency(salesData?.summary.totalRevenue || 0)],
            ['Total Orders', salesData?.summary.totalOrders?.toString() || '0'],
            ['Average Order Value', formatCurrency(salesData?.summary.averageOrderValue || 0)],
          ];

          autoTable(doc, {
            startY: 60,
            head: [summaryData[0]],
            body: summaryData.slice(1),
            theme: 'grid',
          });

          // Add popular items section
          doc.setFontSize(14);
          // @ts-expect-error need to fix it later
          doc.text('Popular Items', 14, doc.lastAutoTable.finalY + 15);

          const popularItemsData = [
            ['Item Name', 'Order Count', 'Revenue'],
            ...(salesData?.popularItems
              .slice(0, 10)
              .map((item) => [item.name, item.count.toString(), formatCurrency(item.revenue)]) ||
              []),
          ];

          autoTable(doc, {
            // @ts-expect-error need to fix it later
            startY: doc.lastAutoTable.finalY + 20,
            head: [popularItemsData[0]],
            body: popularItemsData.slice(1),
            theme: 'grid',
          });

          // Add peak times section
          doc.setFontSize(14);
          // @ts-expect-error need to fix it later
          doc.text('Peak Times by Day of Week', 14, doc.lastAutoTable.finalY + 15);

          const peakTimesByDayData = [
            ['Day', 'Order Count', 'Revenue'],
            ...(salesData?.peakTimes.byDay.map((item) => [
              item.day,
              item.count.toString(),
              formatCurrency(item.revenue),
            ]) || []),
          ];

          autoTable(doc, {
            // @ts-expect-error need to fix it later
            startY: doc.lastAutoTable.finalY + 20,
            head: [peakTimesByDayData[0]],
            body: peakTimesByDayData.slice(1),
            theme: 'grid',
          });

          // Add revenue data
          // @ts-expect-error need to fix it later
          const revenueY = doc.lastAutoTable.finalY;

          if (revenueY > 220) {
            // Add a new page if there's not enough space
            doc.addPage();
            doc.setFontSize(14);
            doc.text(
              `Revenue By ${periodType.charAt(0).toUpperCase() + periodType.slice(1)}`,
              14,
              20
            );

            const revenueData = [
              [
                periodType === 'daily' ? 'Date' : periodType === 'weekly' ? 'Week' : 'Month',
                'Revenue',
              ],
              ...(salesData?.revenueByPeriod[periodType].map((item) => {
                const key =
                  periodType === 'daily' ? 'date' : periodType === 'weekly' ? 'week' : 'month';
                // @ts-expect-error need to fix it later
                return [item[key], formatCurrency(item.revenue)];
              }) || []),
            ];

            autoTable(doc, {
              startY: 25,
              head: [revenueData[0]],
              body: revenueData.slice(1),
              theme: 'grid',
            });
          } else {
            doc.setFontSize(14);
            doc.text(
              `Revenue By ${periodType.charAt(0).toUpperCase() + periodType.slice(1)}`,
              14,
              // @ts-expect-error need to fix it later
              doc.lastAutoTable.finalY + 15
            );

            const revenueData = [
              [
                periodType === 'daily' ? 'Date' : periodType === 'weekly' ? 'Week' : 'Month',
                'Revenue',
              ],
              ...(salesData?.revenueByPeriod[periodType].map((item) => {
                const key =
                  periodType === 'daily' ? 'date' : periodType === 'weekly' ? 'week' : 'month';
                // @ts-expect-error need to fix it later
                return [item[key], formatCurrency(item.revenue)];
              }) || []),
            ];

            autoTable(doc, {
              // @ts-expect-error need to fix it later
              startY: doc.lastAutoTable.finalY + 20,
              head: [revenueData[0]],
              body: revenueData.slice(1),
              theme: 'grid',
            });
          }

          // Generate filename and save
          const filename = `${getCleanFilename()}.pdf`;
          doc.save(filename);
          toast.success('PDF report exported successfully');
        } catch (error) {
          console.error('Failed to export PDF file:', error);
          toast.error('Failed to export PDF file');
        } finally {
          setExportLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load jsPDF:', error);
        toast.error('Failed to load PDF export library');
        setExportLoading(false);
      });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <DatePickerWithRange
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />

          <Select value={periodType} onValueChange={(value: PeriodT) => setPeriodType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={exportLoading}>
                {exportLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(salesData?.summary.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData?.summary.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(salesData?.summary.averageOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="popular-items">Popular Items</TabsTrigger>
          <TabsTrigger value="peak-times">Peak Times</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                {periodType === 'daily'
                  ? 'Daily revenue for selected period'
                  : periodType === 'weekly'
                    ? 'Weekly revenue for selected period'
                    : 'Monthly revenue for selected period'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData?.revenueByPeriod[periodType] || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={
                        periodType === 'daily' ? 'date' : periodType === 'weekly' ? 'week' : 'month'
                      }
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      formatter={(value) => [`${formatCurrency(value as number)}`, 'Revenue']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular-items" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Items</CardTitle>
                <CardDescription>By order count</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData?.popularItems.slice(0, 5) || []}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Items</CardTitle>
                <CardDescription>By total revenue</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          salesData?.popularItems.slice(0, 5).map((item) => ({
                            name: item.name,
                            value: item.revenue,
                          })) || []
                        }
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {salesData?.popularItems
                          .slice(0, 5)
                          .map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="peak-times" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Time of Day</CardTitle>
                <CardDescription>Number of orders per hour</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData?.peakTimes.byHour || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickFormatter={formatHour} />
                      <YAxis />
                      <Tooltip labelFormatter={(label) => `Time: ${formatHour(Number(label))}`} />
                      <Bar dataKey="count" name="Orders" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Day of Week</CardTitle>
                <CardDescription>Total revenue by day</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData?.peakTimes.byDay || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip
                        formatter={(value) => [`${formatCurrency(value as number)}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesDashboard;
