'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import type { Lead } from '@/lib/supabase';
import { toast } from 'sonner';

export default function FilterLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  const fetchLeads = async () => {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Skip filtering when selectedStatus is 'all'
      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Filter Leads</h1>

      <div className="max-w-xs mb-8">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status to filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Not Interested">Not Interested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">{lead.business_name}</h2>
                  <p className="text-muted-foreground">{lead.phone}</p>
                  <p className="text-sm">Location: {lead.location}</p>
                  {lead.link && (
                    <a
                      href={lead.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {lead.link}
                    </a>
                  )}
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {leads.length === 0 && (
          <div className="text-center text-muted-foreground">
            No leads found for the selected status.
          </div>
        )}
      </div>
    </div>
  );
}
