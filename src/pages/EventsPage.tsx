import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, MapPin, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { type Event, EventFormData } from '@/types';

export function EventsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const queryClient = useQueryClient();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.events.getEvents({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: EventFormData) => apiClient.events.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
      setIsDialogOpen(false);
      setIsMultiDay(false);
    },
    onError: (error: any) => toast.error(error.message || 'Failed to create event'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.events.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted');
    },
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? apiClient.events.publishEvent(id) : apiClient.events.unpublishEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get the form values
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const venue = formData.get('venue') as string;
    const capacity = Number(formData.get('capacity'));

    let eventDate: string;
    let startTime: string;
    let endTime: string;

    if (isMultiDay) {
      // For multi-day events: get start and end date-times
      const startDateTime = formData.get('startDateTime') as string;
      const endDateTime = formData.get('endDateTime') as string;

      // Parse the start datetime to extract date and time
      eventDate = startDateTime.split('T')[0]; // Extract date part for eventDate
      startTime = startDateTime; // Full datetime for startTime
      endTime = endDateTime; // Full datetime for endTime
    } else {
      // For single-day events: get event date and separate start/end times
      const eventDateValue = formData.get('eventDate') as string;
      const startTimeValue = formData.get('startTime') as string;
      const endTimeValue = formData.get('endTime') as string;

      // Combine date with times to create full datetime strings
      eventDate = eventDateValue;
      startTime = `${eventDateValue}T${startTimeValue}`;
      endTime = `${eventDateValue}T${endTimeValue}`;
    }

    const data: EventFormData = {
      name,
      description: description || undefined,
      venue,
      eventDate,
      startTime,
      endTime,
      isMultiDay,
      capacity,
    };

    console.log('Submitting event data:', data);
    createMutation.mutate(data);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-slate-600">Manage your events and ticket configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-600 to-amber-600">
              <Plus className="h-4 w-4 mr-2" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Event Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" name="name" required placeholder="e.g., Summer Music Festival" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" name="venue" required placeholder="e.g., National Stadium" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" name="description" placeholder="Brief description of the event" />
              </div>

              {/* Multi-day Event Checkbox */}
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <Checkbox
                  id="isMultiDay"
                  checked={isMultiDay}
                  onCheckedChange={(checked) => setIsMultiDay(checked as boolean)}
                />
                <Label htmlFor="isMultiDay" className="cursor-pointer font-normal">
                  This is a multi-day event
                </Label>
              </div>

              {/* Conditional Date/Time Inputs */}
              {!isMultiDay ? (
                /* Single-day event: Date + Start Time + End Time */
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input id="eventDate" name="eventDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="time" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" name="endTime" type="time" required />
                  </div>
                </div>
              ) : (
                /* Multi-day event: Start DateTime + End DateTime */
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDateTime">Start Date & Time</Label>
                    <Input id="startDateTime" name="startDateTime" type="datetime-local" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDateTime">End Date & Time</Label>
                    <Input id="endDateTime" name="endDateTime" type="datetime-local" required />
                  </div>
                </div>
              )}

              {/* Event Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">Total Event Capacity</Label>
                <Input id="capacity" name="capacity" type="number" required min="1" placeholder="e.g., 1000" />
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsData?.events?.map((event) => {
          const isPublished = event.status === 'published';
          return (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <Link to={`/events/${event._id}`} className="block">
                {(event.posterUrl || event.thumbnailUrl) && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={event.posterUrl || event.thumbnailUrl}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{event.name}</span>
                    {isPublished ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-slate-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(event.eventDate || event.startTime), 'PPp')}
                      {event.isMultiDay && ` - ${format(new Date(event.endTime), 'PPp')}`}
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-xs text-slate-600">Tickets Sold</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {event.totalTicketsSold || 0} / {event.capacity || event.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isPublished ? 'outline' : 'default'}
                    className="flex-1"
                    onClick={() => publishMutation.mutate({ id: event._id, publish: !isPublished })}
                  >
                    {isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(event._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
