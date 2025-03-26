import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Filter } from 'lucide-react';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';

export default function Home() {
  return (
    <div>
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Client Management Dashboard</h1>
          <UserNav />
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/add-lead">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  Add New Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Create a new business lead with contact details and status.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  View All Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage and view all your business leads in one place.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/filter-leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-6 w-6" />
                  Filter Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Filter and sort leads by their current status.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}