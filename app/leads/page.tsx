// pages/leads.tsx or components/Leads.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Pencil, Trash2, MessageSquarePlus, Phone, MessageCircle } from 'lucide-react';

// Define types for Lead and Comment
export interface Lead {
  id: string;
  business_name: string;
  phone: string;
  status: 'Pending' | 'Contacted' | 'Converted' | 'Not Interested';
  link?: string;
  location: string;
  created_at: string;
}

export interface Comment {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
}

export default function Leads() {
  // State Management
  const [leads, setLeads] = useState<Lead[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [newComment, setNewComment] = useState('');
  const [selectedLeadForComment, setSelectedLeadForComment] = useState<string | null>(null);

  // Fetch Leads on Component Mount
  useEffect(() => {
    fetchLeads();
    fetchComments();
  }, []);

  // Fetch Leads from Supabase
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

  // Fetch Comments from Supabase
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

  // Delete Lead
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

  // Update Lead
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

  // Add Comment to Lead
  const handleAddComment = async (leadId: string) => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

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

  // Helper function to format WhatsApp link
  const formatWhatsAppLink = (phoneNumber: string) => {
    // Remove any non-digit characters and add country code if missing
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    // Assuming US number, add +1 if not present
    const formattedNumber = cleanedNumber.startsWith('1') 
      ? `+${cleanedNumber}` 
      : `+1${cleanedNumber}`;
    return `https://wa.me/${formattedNumber}`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Leads Management</h1>
      
      {leads.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No leads found. Start adding leads to get started!
        </div>
      ) : (
        <div className="space-y-6">
          {leads.map((lead) => (
            <Card key={lead.id} className="w-full">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
                  <div className="flex-grow">
                    <h2 className="text-2xl font-semibold">{lead.business_name}</h2>
                    
                    {/* Phone and Communication Links */}
                    <div className="flex items-center gap-3 mt-2">
                      <a 
                        href={`tel:${lead.phone}`} 
                        className="text-muted-foreground hover:text-primary flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </a>
                      <a 
                        href={formatWhatsAppLink(lead.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 flex items-center"
                        title="Message on WhatsApp"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M12.036 5.339c-3.635 0-6.597 2.96-6.597 6.597 0 1.356.408 2.615 1.105 3.669l.057.088-1.372 4.08 4.328-1.178.077.045c1.119.664 2.405 1.015 3.702 1.015 3.635 0 6.597-2.96 6.597-6.596 0-3.635-2.961-6.597-6.597-6.597zM3.495 20.505l.848-3.748a8.082 8.082 0 0 1-1.344-4.518c0-4.485 3.65-8.135 8.135-8.135 4.485 0 8.135 3.65 8.135 8.135 0 4.485-3.65 8.135-8.135 8.135a8.435 8.435 0 0 1-4.015-1.036l-4.624 1.267zm9.012-5.172l1.456-1.285-1.456-1.285L12 9.807z"/>
                        </svg>
                      </a>
                    </div>
                    
                    <p className="text-sm mt-1 text-muted-foreground">
                      <MessageCircle className="inline-block h-4 w-4 mr-1" />
                      {lead.location}
                    </p>
                    
                    {lead.link && (
                      <a
                        href={lead.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline block mt-1 truncate max-w-xs"
                      >
                        🔗 {lead.link}
                      </a>
                    )}
                    
                    <div className="mt-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${
                          lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                          lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 self-start">
                    {/* Edit Lead Dialog */}
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
                          <DialogTitle>Edit Lead: {lead.business_name}</DialogTitle>
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
                                setEditLead({ 
                                  ...editLead, 
                                  status: value as Lead['status'] 
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Contacted">Contacted</SelectItem>
                                <SelectItem value="Converted">Converted</SelectItem>
                                <SelectItem value="Not Interested">Not Interested</SelectItem>
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

                    {/* Delete Lead Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Add Comment Dialog */}
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
                          <DialogTitle>Add Comment to {lead.business_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Enter your comment"
                            className="w-full"
                          />
                          <Button
                            onClick={() => handleAddComment(lead.id)}
                            className="w-full"
                            disabled={!newComment.trim()}
                          >
                            Add Comment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-4 bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    Comments
                  </h3>
                  {comments.filter((comment) => comment.lead_id === lead.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  ) : (
                    <div className="space-y-2">
                      {comments
                        .filter((comment) => comment.lead_id === lead.id)
                        .map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-3 rounded-md text-sm shadow-sm"
                          >
                            {comment.content}
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}