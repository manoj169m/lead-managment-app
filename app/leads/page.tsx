'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Lead, Comment } from '@/lib/supabase';
import { toast } from 'sonner';
import { Pencil, Trash2, MessageSquarePlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [newComment, setNewComment] = useState('');
  const [selectedLeadForComment, setSelectedLeadForComment] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchComments();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      toast.error('Failed to fetch comments');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      
      setLeads(leads.filter((lead) => lead.id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error('Failed to delete lead');
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (lead: Lead) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          business_name: lead.business_name,
          phone: lead.phone,
          status: lead.status,
          link: lead.link,
          location: lead.location,
        })
        .eq('id', lead.id);

      if (error) throw error;
      
      setLeads(leads.map((l) => (l.id === lead.id ? lead : l)));
      setEditLead(null);
      toast.success('Lead updated successfully');
    } catch (error) {
      toast.error('Failed to update lead');
      console.error('Error:', error);
    }
  };

  const handleAddComment = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            lead_id: leadId,
            content: newComment,
          },
        ])
        .select();

      if (error) throw error;
      
      setComments([...(data || []), ...comments]);
      setNewComment('');
      setSelectedLeadForComment(null);
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">All Leads</h1>
      
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
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditLead(lead)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Lead</DialogTitle>
                      </DialogHeader>
                      {editLead && (
                        <div className="space-y-4">
                          <Input
                            value={editLead.business_name}
                            onChange={(e) =>
                              setEditLead({
                                ...editLead,
                                business_name: e.target.value,
                              })
                            }
                            placeholder="Business Name"
                          />
                          <Input
                            value={editLead.phone}
                            onChange={(e) =>
                              setEditLead({ ...editLead, phone: e.target.value })
                            }
                            placeholder="Phone"
                          />
                          <Select
                            value={editLead.status}
                            onValueChange={(value) =>
                              setEditLead({ ...editLead, status: value as Lead['status'] })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="Converted">Converted</SelectItem>
                              <SelectItem value="Not Interested">
                                Not Interested
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={editLead.link || ''}
                            onChange={(e) =>
                              setEditLead({ ...editLead, link: e.target.value })
                            }
                            placeholder="Link (Optional)"
                          />
                          <Input
                            value={editLead.location}
                            onChange={(e) =>
                              setEditLead({
                                ...editLead,
                                location: e.target.value,
                              })
                            }
                            placeholder="Location"
                          />
                          <Button
                            onClick={() => handleUpdate(editLead)}
                            className="w-full"
                          >
                            Update Lead
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(lead.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedLeadForComment(lead.id)}
                      >
                        <MessageSquarePlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Comment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Enter your comment"
                        />
                        <Button
                          onClick={() => handleAddComment(lead.id)}
                          className="w-full"
                        >
                          Add Comment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Comments:</h3>
                <div className="space-y-2">
                  {comments
                    .filter((comment) => comment.lead_id === lead.id)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-muted p-3 rounded-md text-sm"
                      >
                        {comment.content}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}