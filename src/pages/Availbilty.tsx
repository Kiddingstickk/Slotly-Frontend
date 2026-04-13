import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 22; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "AM" : "PM";
    const mins = m === 0 ? "00" : "30";
    TIME_OPTIONS.push(`${hour12}:${mins} ${ampm}`);
  }
}

const SLOT_DURATIONS = ["15", "30", "45", "60", "90", "120"];

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

const defaultSchedule = (): Record<string, DaySchedule> =>
  Object.fromEntries(
    DAYS.map((day) => [
      day,
      {
        enabled: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day),
        start: "9:00 AM",
        end: "5:00 PM",
      },
    ])
  );

const AvailabilityPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { businessId } = useParams(); // assuming route like /availability/:businessId
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(defaultSchedule);
  const [slotDuration, setSlotDuration] = useState("30");

  const updateDay = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      // Transform schedule into backend format
      const availability = Object.entries(schedule)
        .filter(([_, d]) => d.enabled)
        .map(([day, d]) => ({
          day_of_week: day,
          start_time: convertTo24Hour(d.start),
          end_time: convertTo24Hour(d.end),
          slot_duration: parseInt(slotDuration),
        }));

      await axios.post(
        "https://slotly-backend-92ig.onrender.com/api/availability/batch",
        {
          business_id: businessId,
          availability,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // or however you store auth
          },
        }
      );

      toast({
        title: "Availability saved!",
        description: `Slot duration set to ${slotDuration} minutes.`,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error saving availability:", err);
      toast({
        title: "Error",
        description: "Failed to save availability.",
        variant: "destructive",
      });
    }
  };

  // Helper: convert "9:00 AM" → "09:00"
  const convertTo24Hour = (time: string) => {
    const [hourMin, ampm] = time.split(" ");
    let [hour, minute] = hourMin.split(":").map(Number);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${minute}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/register">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="font-bold text-foreground">Set Your Availability</span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Working Hours</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the days and times you're available for appointments.
          </p>
        </div>

        {/* Day rows */}
        <div className="space-y-3">
          {DAYS.map((day) => {
            const d = schedule[day];
            return (
              <div
                key={day}
                className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  d.enabled ? "bg-card" : "bg-muted/40 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={d.enabled}
                    onCheckedChange={(v) => updateDay(day, "enabled", v)}
                  />
                  <span className="w-24 text-sm font-semibold text-foreground">{day}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={d.start}
                    onValueChange={(v) => updateDay(day, "start", v)}
                    disabled={!d.enabled}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-sm text-muted-foreground">to</span>

                  <Select
                    value={d.end}
                    onValueChange={(v) => updateDay(day, "end", v)}
                    disabled={!d.enabled}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slot Duration */}
        <div className="space-y-3 rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">Slot Duration</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            How long is each appointment slot?
          </p>
          <ToggleGroup
            type="single"
            value={slotDuration}
            onValueChange={(v) => v && setSlotDuration(v)}
            className="flex flex-wrap gap-2"
          >
            {SLOT_DURATIONS.map((d) => (
              <ToggleGroupItem
                key={d}
                value={d}
                className="rounded-lg border px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {d} min
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Button onClick={handleSave} size="lg" className="w-full text-base">
          Save Availability
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityPage;