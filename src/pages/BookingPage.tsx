import { useState, useEffect } from "react";
import { Link, useParams , useNavigate } from "react-router-dom";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BookingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { businessId } = useParams();

  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch business info
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`https://slotly-backend-92ig.onrender.com/api/businesses/${businessId}`);
        setBusinessInfo(res.data);
      } catch (err) {
        console.error("Error fetching business:", err);
      }
    };
    if (businessId) fetchBusiness();
  }, [businessId]);

  // Fetch availability when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !businessId) return;
      try {
        const dayName = format(date, "EEEE"); // "Monday"
        const dateString = format(date, "yyyy-MM-dd"); // "2026-03-09"

        const res = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/availability/business/${businessId}/slots?day=${dayName}&date=${dateString}`
        );

        let slots = res.data.slots || [];

        // If selected date is today, mark past times
        const today = startOfDay(new Date());
        if (date.toDateString() === today.toDateString()) {
          const now = new Date();
          slots = slots.map((s: any) => {
            const [hh, mm] = s.time.split(":").map(Number);
            const slotDate = new Date();
            slotDate.setHours(hh, mm, 0, 0);
            return {
              ...s,
              past: slotDate < now,
            };
          });
        }

        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };
    fetchAvailability();
  }, [date, businessId]);

  // Helper: parse service duration into minutes
  const getServiceDurationMinutes = (serviceName: string) => {
    const s = businessInfo?.services.find((srv: any) => srv.name === serviceName);
    if (!s || !s.duration) return 0;

    const lower = s.duration.toLowerCase();
    if (lower.includes("hour")) {
      const hours = parseInt(lower);
      return hours * 60;
    }
    return parseInt(lower); // assume "30 mins" etc.
  };

  // Check if a slot is valid for the selected service
  const isSlotAvailable = (index: number) => {
    if (!service) return true; // no service selected yet
    const serviceDuration = getServiceDurationMinutes(service);
    if (!serviceDuration) return true;

    const slotDuration = businessInfo?.slot_duration || 30; // fallback
    const slotsNeeded = Math.ceil(serviceDuration / slotDuration);

    for (let i = 0; i < slotsNeeded; i++) {
      const slot = availableSlots[index + i];
      if (!slot || slot.booked || slot.past) return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !date || !time) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
     const customerId = localStorage.getItem("customerId");
     const bookingPayload = {
      business_id: businessId,
      service_id: service,
      booking_date: format(date, "yyyy-MM-dd"),
      booking_time: time,
      notes,
    };

     if (!customerId) {
    // Save booking intent and redirect to login
    localStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));
    toast({ title: "Please log in to complete your booking" });
    navigate("/customer/login");
    return;
   }


    try {
      await axios.post("https://slotly-backend-92ig.onrender.com/api/bookings/create", {
        ...bookingPayload,
      customer_id: customerId,
    });
      toast({
        title: "Booking created!",
        description: `${name}, your ${service} is confirmed for ${format(date, "PPP")} at ${time}.`,
      });
      setService(""); setDate(undefined); setTime(""); setNotes("");
    } catch (err) {
      console.error("Error creating booking:", err);
      toast({ title: "Booking failed", description: "Please try again.", variant: "destructive" });
    }
  };

  if (!businessInfo) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/${businessInfo._id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <span className="font-bold text-foreground">{businessInfo.name}</span>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5 px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">Book an Appointment</h1>

        {/* Service */}
        <div className="space-y-2">
          <Label>Service *</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {businessInfo.services.map((s: any, idx: number) => (
                <SelectItem key={idx} value={s.name}>
                  {s.name} — ₹{s.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Name 
        <div className="space-y-2">
          <Label>Your Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
        </div>

         Phone 
        <div className="space-y-2">
          <Label>Phone Number *</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" type="tel" />
        </div>*/}

        {/* Date */}
        <div className="space-y-2">
          <Label>Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < startOfDay(new Date())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label>Time *</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
            <SelectContent>
              {availableSlots.length > 0 ? (
                availableSlots.map((slotObj: any, idx: number) => {
                  const disabled = !isSlotAvailable(idx);
                  return (
                    <SelectItem
                      key={idx}
                      value={slotObj.time}
                      disabled={disabled}
                      className={disabled ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {slotObj.time} {slotObj.booked && "(Booked)"} {slotObj.past && "(Past)"}
                    </SelectItem>
                  );
                })
              ) : (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No slots available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests..."
            rows={3}
          />
        </div>

        <Button type="submit" size="lg" className="w-full text-base">
          Confirm Booking
        </Button>
      </form>
    </div>
  );
};

export default BookingPage;

             