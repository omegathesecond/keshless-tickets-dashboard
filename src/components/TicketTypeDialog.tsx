import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TicketType } from '@/types';

interface TicketTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }) => void;
  ticketType?: TicketType | null;
  isLoading?: boolean;
}

export function TicketTypeDialog({
  open,
  onOpenChange,
  onSubmit,
  ticketType,
  isLoading = false,
}: TicketTypeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 1,
  });

  useEffect(() => {
    if (ticketType) {
      setFormData({
        name: ticketType.name,
        description: ticketType.description || '',
        price: ticketType.price,
        quantity: ticketType.quantity,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 1,
      });
    }
  }, [ticketType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      price: formData.price,
      quantity: formData.quantity,
    });
  };

  const isEdit = !!ticketType;
  const hasSold = ticketType && ticketType.sold > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Ticket Type' : 'Add Ticket Type'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ticket Type Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., General, VIP, Early Bird"
              required
              disabled={hasSold}
            />
            {hasSold && (
              <p className="text-xs text-amber-600">
                Cannot change name after tickets have been sold
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's included with this ticket?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (E)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min="0"
                step="0.01"
                required
                disabled={hasSold}
              />
              {hasSold && (
                <p className="text-xs text-amber-600">
                  Cannot change price after tickets sold
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                min={hasSold ? ticketType.sold : 1}
                required
              />
              {hasSold && (
                <p className="text-xs text-slate-600">
                  Min: {ticketType.sold} (already sold)
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update Ticket Type' : 'Add Ticket Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
