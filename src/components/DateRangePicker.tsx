import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface DateRange {
  startDate: string | undefined;
  endDate: string | undefined;
  preset?: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const PRESETS = [
  { label: 'Last 7 days', value: '7days', days: 7 },
  { label: 'Last 30 days', value: '30days', days: 30 },
  { label: 'Last 90 days', value: '90days', days: 90 },
  { label: 'All time', value: 'all', days: null },
  { label: 'Custom range', value: 'custom', days: null },
];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePresetChange = (preset: string) => {
    const selectedPreset = PRESETS.find((p) => p.value === preset);

    if (preset === 'all') {
      onChange({ startDate: undefined, endDate: undefined, preset });
    } else if (preset === 'custom') {
      onChange({
        startDate: customStart || undefined,
        endDate: customEnd || undefined,
        preset
      });
    } else if (selectedPreset?.days) {
      const end = endOfDay(new Date());
      const start = startOfDay(subDays(end, selectedPreset.days));
      onChange({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        preset,
      });
    }
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      const start = startOfDay(new Date(customStart));
      const end = endOfDay(new Date(customEnd));
      onChange({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        preset: 'custom',
      });
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    const preset = PRESETS.find((p) => p.value === value.preset);
    if (preset && preset.value !== 'custom') {
      return preset.label;
    }

    if (value.startDate && value.endDate) {
      try {
        const start = format(new Date(value.startDate), 'MMM dd, yyyy');
        const end = format(new Date(value.endDate), 'MMM dd, yyyy');
        return `${start} - ${end}`;
      } catch {
        return 'Select date range';
      }
    }

    return value.preset === 'all' ? 'All time' : 'Select date range';
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select
                value={value.preset || 'all'}
                onValueChange={handlePresetChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a date range" />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {value.preset === 'custom' && (
              <div className="space-y-3 border-t pt-3">
                <div className="space-y-1">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    min={customStart}
                  />
                </div>
                <Button
                  onClick={handleCustomApply}
                  className="w-full"
                  disabled={!customStart || !customEnd}
                >
                  Apply Custom Range
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
