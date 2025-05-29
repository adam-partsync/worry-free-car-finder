"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wrench,
  Car,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Bell,
  TrendingUp,
  Settings,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Upload
} from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registration?: string;
  mileage?: number;
  nickname?: string;
  isActive: boolean;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceType: string;
  description: string;
  serviceProvider?: string;
  mileage?: number;
  cost?: number;
  laborCost?: number;
  partsCost?: number;
  nextServiceDue?: string;
  nextServiceMileage?: number;
  notes?: string;
  serviceDate: string;
  isCompleted: boolean;
  vehicle: Vehicle;
}

const serviceTypes = [
  { value: 'oil_change', label: 'Oil Change', icon: '🛢️' },
  { value: 'tire_rotation', label: 'Tire Rotation', icon: '🛞' },
  { value: 'brake_service', label: 'Brake Service', icon: '🛑' },
  { value: 'battery_check', label: 'Battery Check', icon: '🔋' },
  { value: 'air_filter', label: 'Air Filter', icon: '💨' },
  { value: 'mot', label: 'MOT Test', icon: '📋' },
  { value: 'annual_service', label: 'Annual Service', icon: '🔧' },
  { value: 'repair', label: 'Repair', icon: '🔨' },
  { value: 'warranty_work', label: 'Warranty Work', icon: '🛡️' },
  { value: 'other', label: 'Other', icon: '⚙️' }
];

export default function MaintenanceTracker() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);

  // Form states
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registration: '',
    mileage: '',
    nickname: ''
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    vehicleId: '',
    serviceType: '',
    description: '',
    serviceProvider: '',
    mileage: '',
    cost: '',
    laborCost: '',
    partsCost: '',
    nextServiceDue: '',
    nextServiceMileage: '',
    notes: '',
    serviceDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (session?.user || demoMode) {
      fetchVehicles();
      fetchMaintenanceRecords();
    }
  }, [session]);

  const fetchVehicles = async () => {
    try {
      if (!session?.user && demoMode) {
        // Demo data
        const demoVehicles = [
          {
            id: 'demo-1',
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            registration: 'AB20 CDE',
            mileage: 45000,
            nickname: 'My Toyota',
            isActive: true
          },
          {
            id: 'demo-2',
            make: 'BMW',
            model: '320i',
            year: 2019,
            registration: 'XY19 ZAB',
            mileage: 52000,
            nickname: 'Weekend Car',
            isActive: true
          }
        ];
        setVehicles(demoVehicles);
        if (demoVehicles.length > 0 && !selectedVehicle) {
          setSelectedVehicle(demoVehicles[0].id);
        }
        return;
      }

      const response = await fetch('/api/maintenance/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles);
        if (data.vehicles.length > 0 && !selectedVehicle) {
          setSelectedVehicle(data.vehicles[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchMaintenanceRecords = async () => {
    try {
      if (!session?.user && demoMode) {
        // Demo maintenance records
        const demoRecords = [
          {
            id: 'demo-record-1',
            vehicleId: 'demo-1',
            serviceType: 'oil_change',
            description: 'Oil and filter change',
            serviceProvider: 'QuickLube',
            mileage: 45000,
            cost: 45,
            laborCost: 20,
            partsCost: 25,
            nextServiceDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
            nextServiceMileage: 50000,
            notes: 'Used synthetic oil',
            serviceDate: '2024-01-15',
            isCompleted: true,
            vehicle: {
              id: 'demo-1',
              make: 'Toyota',
              model: 'Camry',
              year: 2020,
              registration: 'AB20 CDE',
              mileage: 45000,
              nickname: 'My Toyota',
              isActive: true
            }
          },
          {
            id: 'demo-record-2',
            vehicleId: 'demo-1',
            serviceType: 'brake_service',
            description: 'Front brake pads replacement',
            serviceProvider: 'City Auto',
            mileage: 42000,
            cost: 180,
            laborCost: 80,
            partsCost: 100,
            nextServiceDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            nextServiceMileage: 65000,
            notes: 'Rear brakes still good',
            serviceDate: '2023-11-20',
            isCompleted: true,
            vehicle: {
              id: 'demo-1',
              make: 'Toyota',
              model: 'Camry',
              year: 2020,
              registration: 'AB20 CDE',
              mileage: 45000,
              nickname: 'My Toyota',
              isActive: true
            }
          },
          {
            id: 'demo-record-3',
            vehicleId: 'demo-2',
            serviceType: 'annual_service',
            description: 'Annual service and MOT',
            serviceProvider: 'BMW Service',
            mileage: 50000,
            cost: 350,
            laborCost: 200,
            partsCost: 150,
            nextServiceDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            nextServiceMileage: 60000,
            notes: 'Passed MOT with advisory on tyres',
            serviceDate: '2024-01-20',
            isCompleted: true,
            vehicle: {
              id: 'demo-2',
              make: 'BMW',
              model: '320i',
              year: 2019,
              registration: 'XY19 ZAB',
              mileage: 52000,
              nickname: 'Weekend Car',
              isActive: true
            }
          }
        ];
        setMaintenanceRecords(demoRecords);
        return;
      }

      const response = await fetch('/api/maintenance/records');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceRecords(data.records);
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const addVehicle = async () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year) return;

    setLoading(true);
    try {
      const response = await fetch('/api/maintenance/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vehicleForm,
          year: Number(vehicleForm.year),
          mileage: vehicleForm.mileage ? Number(vehicleForm.mileage) : null
        })
      });

      if (response.ok) {
        await fetchVehicles();
        setShowAddVehicle(false);
        setVehicleForm({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          registration: '',
          mileage: '',
          nickname: ''
        });
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
    setLoading(false);
  };

  const addMaintenanceRecord = async () => {
    if (!maintenanceForm.vehicleId || !maintenanceForm.serviceType || !maintenanceForm.description) return;

    setLoading(true);
    try {
      const response = await fetch('/api/maintenance/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...maintenanceForm,
          mileage: maintenanceForm.mileage ? Number(maintenanceForm.mileage) : null,
          cost: maintenanceForm.cost ? Number(maintenanceForm.cost) : null,
          laborCost: maintenanceForm.laborCost ? Number(maintenanceForm.laborCost) : null,
          partsCost: maintenanceForm.partsCost ? Number(maintenanceForm.partsCost) : null,
          nextServiceMileage: maintenanceForm.nextServiceMileage ? Number(maintenanceForm.nextServiceMileage) : null
        })
      });

      if (response.ok) {
        await fetchMaintenanceRecords();
        setShowAddMaintenance(false);
        setMaintenanceForm({
          vehicleId: '',
          serviceType: '',
          description: '',
          serviceProvider: '',
          mileage: '',
          cost: '',
          laborCost: '',
          partsCost: '',
          nextServiceDue: '',
          nextServiceMileage: '',
          notes: '',
          serviceDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error adding maintenance record:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFilteredRecords = () => {
    if (!selectedVehicle) return maintenanceRecords;
    return maintenanceRecords.filter(record => record.vehicleId === selectedVehicle);
  };

  const getMaintenanceStats = () => {
    const records = getFilteredRecords();
    const totalCost = records.reduce((sum, record) => sum + (record.cost || 0), 0);
    const avgCost = records.length > 0 ? totalCost / records.length : 0;
    const lastService = records.length > 0 ? records.sort((a, b) =>
      new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
    )[0] : null;

    return {
      totalRecords: records.length,
      totalCost,
      avgCost,
      lastService
    };
  };

  const getUpcomingMaintenance = () => {
    const now = new Date();
    const upcoming = maintenanceRecords.filter(record => {
      if (!record.nextServiceDue) return false;
      const nextDue = new Date(record.nextServiceDue);
      const daysUntil = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 30 && daysUntil >= 0;
    });
    return upcoming.sort((a, b) =>
      new Date(a.nextServiceDue!).getTime() - new Date(b.nextServiceDue!).getTime()
    );
  };

  const stats = getMaintenanceStats();
  const upcomingMaintenance = getUpcomingMaintenance();

  // Temporarily disable auth check for demo purposes
  const demoMode = true;

  if (!session?.user && !demoMode) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sign in to Track Maintenance
          </h3>
          <p className="text-gray-600 mb-4">
            Keep track of your vehicle's maintenance history and upcoming services.
          </p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Demo Mode Banner */}
      {demoMode && !session?.user && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <strong>Demo Mode:</strong> You're viewing sample data. Sign in to track your own vehicles and maintenance records.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="h-8 w-8 text-blue-600" />
            Maintenance Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Keep track of your vehicle's service history and maintenance schedule
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddVehicle(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Car className="h-4 w-4" />
            Add Vehicle
          </Button>
          <Button
            onClick={() => setShowAddMaintenance(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Log Service
          </Button>
        </div>
      </div>

      {/* Vehicle Selector */}
      {vehicles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label>Select Vehicle:</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.nickname || `${vehicle.make} ${vehicle.model}`} ({vehicle.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-auto">
                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {vehicles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Vehicles Added
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your first vehicle to start tracking maintenance records.
                </p>
                <Button onClick={() => setShowAddVehicle(true)}>
                  <Car className="h-4 w-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Services</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
                    </div>
                    <Wrench className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCost)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Service Cost</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.avgCost)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Services & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getFilteredRecords().slice(0, 5).map(record => (
                  <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {serviceTypes.find(s => s.value === record.serviceType)?.icon || '⚙️'}
                      </div>
                      <div>
                        <p className="font-medium">{record.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.serviceDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {record.cost && (
                      <Badge variant="outline">{formatCurrency(record.cost)}</Badge>
                    )}
                  </div>
                ))}
                {getFilteredRecords().length === 0 && (
                  <p className="text-gray-600 text-center py-4">No service records yet</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Upcoming Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingMaintenance.map(record => {
                  const daysUntil = Math.ceil(
                    (new Date(record.nextServiceDue!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {serviceTypes.find(s => s.value === record.serviceType)?.icon || '⚙️'}
                        </div>
                        <div>
                          <p className="font-medium">{record.description}</p>
                          <p className="text-sm text-gray-600">
                            Due: {new Date(record.nextServiceDue!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={daysUntil <= 7 ? "destructive" : "secondary"}>
                        {daysUntil} days
                      </Badge>
                    </div>
                  );
                })}
                {upcomingMaintenance.length === 0 && (
                  <p className="text-gray-600 text-center py-4">No upcoming maintenance scheduled</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Service History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Complete Service History
              </CardTitle>
              <CardDescription>
                All maintenance records for your {selectedVehicle ? 'selected vehicle' : 'vehicles'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredRecords().map(record => (
                  <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {serviceTypes.find(s => s.value === record.serviceType)?.icon || '⚙️'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{record.description}</h3>
                            <Badge variant="outline">
                              {serviceTypes.find(s => s.value === record.serviceType)?.label || record.serviceType}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Date:</span> {new Date(record.serviceDate).toLocaleDateString()}
                            </div>
                            {record.mileage && (
                              <div>
                                <span className="font-medium">Mileage:</span> {record.mileage.toLocaleString()} mi
                              </div>
                            )}
                            {record.serviceProvider && (
                              <div>
                                <span className="font-medium">Provider:</span> {record.serviceProvider}
                              </div>
                            )}
                            {record.cost && (
                              <div>
                                <span className="font-medium">Cost:</span> {formatCurrency(record.cost)}
                              </div>
                            )}
                          </div>
                          {record.notes && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {record.notes}
                            </div>
                          )}
                          {record.nextServiceDue && (
                            <div className="mt-2 text-sm text-orange-600">
                              <span className="font-medium">Next service due:</span> {new Date(record.nextServiceDue).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {getFilteredRecords().length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Service Records</h3>
                    <p className="text-gray-600 mb-4">Start logging your vehicle's maintenance history.</p>
                    <Button onClick={() => setShowAddMaintenance(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Log First Service
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Maintenance Reminders
              </CardTitle>
              <CardDescription>
                Stay on top of your vehicle's maintenance schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMaintenance.map(record => {
                  const daysUntil = Math.ceil(
                    (new Date(record.nextServiceDue!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysUntil < 0;
                  const isUrgent = daysUntil <= 7;

                  return (
                    <Alert key={record.id} className={isOverdue ? "border-red-200 bg-red-50" : isUrgent ? "border-orange-200 bg-orange-50" : ""}>
                      <AlertTriangle className={`h-4 w-4 ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-blue-500"}`} />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{record.description}</p>
                            <p className="text-sm text-gray-600">
                              {isOverdue ? 'Overdue by' : 'Due in'} {Math.abs(daysUntil)} day{Math.abs(daysUntil) !== 1 ? 's' : ''}
                              ({new Date(record.nextServiceDue!).toLocaleDateString()})
                            </p>
                          </div>
                          <Button size="sm" variant={isOverdue ? "destructive" : isUrgent ? "default" : "outline"}>
                            Schedule Service
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                })}
                {upcomingMaintenance.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No upcoming maintenance reminders at this time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Maintenance Cost:</span>
                    <span className="font-bold">{formatCurrency(stats.totalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Cost per Service:</span>
                    <span className="font-bold">{formatCurrency(stats.avgCost)}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {serviceTypes.map(type => {
                      const typeRecords = getFilteredRecords().filter(r => r.serviceType === type.value);
                      const typeCost = typeRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
                      if (typeRecords.length === 0) return null;

                      return (
                        <div key={type.value} className="flex justify-between text-sm">
                          <span>{type.icon} {type.label}:</span>
                          <span>{formatCurrency(typeCost)} ({typeRecords.length} services)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Service Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
                    <p className="text-gray-600">Total Services</p>
                  </div>
                  {stats.lastService && (
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {Math.ceil((new Date().getTime() - new Date(stats.lastService.serviceDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p className="text-gray-600">Days since last service</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Vehicle</CardTitle>
              <CardDescription>Register a vehicle to start tracking maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g. Camry"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, year: Number(e.target.value) }))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration">Registration</Label>
                  <Input
                    id="registration"
                    value={vehicleForm.registration}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
                    placeholder="AB12 CDE"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={vehicleForm.mileage}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, mileage: e.target.value }))}
                    placeholder="e.g. 50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    value={vehicleForm.nickname}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="e.g. My Car"
                  />
                </div>
              </div>
            </CardContent>
            <div className="flex gap-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setShowAddVehicle(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addVehicle}
                disabled={loading || !vehicleForm.make || !vehicleForm.model}
                className="flex-1"
              >
                {loading ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showAddMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Log Maintenance Service</CardTitle>
              <CardDescription>Record a completed or scheduled maintenance service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceVehicle">Vehicle *</Label>
                  <Select
                    value={maintenanceForm.vehicleId}
                    onValueChange={(value) => setMaintenanceForm(prev => ({ ...prev, vehicleId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.nickname || `${vehicle.make} ${vehicle.model}`} ({vehicle.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select
                    value={maintenanceForm.serviceType}
                    onValueChange={(value) => setMaintenanceForm(prev => ({ ...prev, serviceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Changed engine oil and filter"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceDate">Service Date *</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={maintenanceForm.serviceDate}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, serviceDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceProvider">Service Provider</Label>
                  <Input
                    id="serviceProvider"
                    value={maintenanceForm.serviceProvider}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, serviceProvider: e.target.value }))}
                    placeholder="e.g. Joe's Garage"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMileage">Mileage</Label>
                  <Input
                    id="maintenanceMileage"
                    type="number"
                    value={maintenanceForm.mileage}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, mileage: e.target.value }))}
                    placeholder="Current mileage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCost">Total Cost (£)</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    step="0.01"
                    value={maintenanceForm.cost}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laborCost">Labor Cost (£)</Label>
                  <Input
                    id="laborCost"
                    type="number"
                    step="0.01"
                    value={maintenanceForm.laborCost}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, laborCost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partsCost">Parts Cost (£)</Label>
                  <Input
                    id="partsCost"
                    type="number"
                    step="0.01"
                    value={maintenanceForm.partsCost}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, partsCost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextServiceDue">Next Service Due</Label>
                  <Input
                    id="nextServiceDue"
                    type="date"
                    value={maintenanceForm.nextServiceDue}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, nextServiceDue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextServiceMileage">Next Service Mileage</Label>
                  <Input
                    id="nextServiceMileage"
                    type="number"
                    value={maintenanceForm.nextServiceMileage}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, nextServiceMileage: e.target.value }))}
                    placeholder="e.g. 60000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={maintenanceForm.notes}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the service..."
                  rows={3}
                />
              </div>
            </CardContent>
            <div className="flex gap-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setShowAddMaintenance(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addMaintenanceRecord}
                disabled={loading || !maintenanceForm.vehicleId || !maintenanceForm.serviceType || !maintenanceForm.description}
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Save Record'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
