import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Plus, 
  UserCheck, 
  Activity,
  Award,
  BookOpen,
  Phone,
  Mail
} from 'lucide-react';

const TrainerDashboard = () => {
  const { profile } = useAuth();

  // Mock data - these would come from API calls in real implementation
  const stats = {
    totalClients: 12,
    activeWorkouts: 8,
    completedToday: 5,
    weeklyProgress: 85
  };

  const recentClients = [
    { id: 1, name: 'John Doe', lastWorkout: '2 hours ago', progress: 'On track' },
    { id: 2, name: 'Jane Smith', lastWorkout: '1 day ago', progress: 'Excellent' },
    { id: 3, name: 'Mike Johnson', lastWorkout: '3 days ago', progress: 'Behind schedule' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Welcome back, {profile?.first_name || 'Trainer'}!
              </h1>
              <p className="text-secondary">
                Manage your clients and track their fitness progress
              </p>
            </div>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalClients}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">+2 this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Active Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.activeWorkouts}</div>
              <p className="text-xs text-green-600 dark:text-green-400">Running this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.completedToday}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">Workouts finished</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.weeklyProgress}%</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Average completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Client Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-accent">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-primary">{client.name}</p>
                          <p className="text-sm text-secondary">Last workout: {client.lastWorkout}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={client.progress === 'Excellent' ? 'default' : 
                                client.progress === 'On track' ? 'secondary' : 'destructive'}
                      >
                        {client.progress}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trainer Profile Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-primary">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-sm text-secondary">{profile?.specialization || 'Personal Trainer'}</p>
                </div>

                <div className="space-y-3 text-sm">
                  {profile?.certification && (
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Certified: {profile.certification}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.username && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">{profile.username}</span>
                    </div>
                  )}
                </div>

                {profile?.bio && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-secondary">{profile.bio}</p>
                  </div>
                )}

                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Workout
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for detailed sections */}
        <div className="mt-8">
          <Tabs defaultValue="clients" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clients">Client Management</TabsTrigger>
              <TabsTrigger value="templates">Workout Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clients" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>
                    Manage your clients, track their progress, and assign workouts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                    <p className="text-secondary mb-4">Start by inviting your first client to get started</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite First Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Templates</CardTitle>
                  <CardDescription>
                    Create and manage reusable workout templates for your clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Dumbbell className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No templates created</h3>
                    <p className="text-secondary mb-4">Create your first workout template to get started</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>
                    View detailed analytics about your clients' progress and your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics coming soon</h3>
                    <p className="text-secondary mb-4">Detailed analytics will be available once you have clients and data</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;