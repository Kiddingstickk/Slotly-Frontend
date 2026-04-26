import { useState, useEffect } from "react";
import { Link, useParams , useNavigate } from "react-router-dom";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  const [employees, setEmployees] = useState<any[]>([]);   // NEW
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [service, setService] = useState("");
  const [employeeId, setEmployeeId] = useState("");        // NEW
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch business info + employees
  useEffect(() => {
    const fetchBusinessAndEmployees = async () => {
      try {
        const [bizRes, empRes] = await Promise.all([
          axios.get(`https://slotly-backend-92ig.onrender.com/api/businesses/${businessId}`),
          axios.get(`https://slotly-backend-92ig.onrender.com/api/employees/business/${businessId}`)
        ]);
        setBusinessInfo(bizRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.error("Error fetching business or employees:", err);
      }
    };
    if (businessId) fetchBusinessAndEmployees();
  }, [businessId]);

  // Fetch availability when date or employee changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !businessId || !employeeId) return;
      try {
        const dayName = format(date, "EEEE");
        const dateString = format(date, "yyyy-MM-dd");

        const res = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/availability/business/${businessId}/slots?employeeId=${employeeId}&day=${dayName}&date=${dateString}`
        );

        let slots = res.data.slots || [];

        // Mark past times if today
        const today = startOfDay(new Date());
        if (date.toDateString() === today.toDateString()) {
          const now = new Date();
          slots = slots.map((s: any) => {
            const [hh, mm] = s.time.split(":").map(Number);
            const slotDate = new Date();
            slotDate.setHours(hh, mm, 0, 0);
            return { ...s, past: slotDate < now };
          });
        }

        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };
    fetchAvailability();
  }, [date, businessId, employeeId]);

const filteredEmployees = service
  ? employees.filter((emp: any) => emp.services.includes(service))
  : employees;

const filteredServices = employeeId
  ? businessInfo?.services.filter((srv: any) => {
      const emp = employees.find((e: any) => e._id === employeeId);
      return emp?.services.includes(srv.name);
    })
  : businessInfo?.services || [];


  // Helper: parse service duration into minutes
  const getServiceDurationMinutes = (serviceName: string) => {
    const s = businessInfo?.services.find((srv: any) => srv.name === serviceName);
    if (!s || !s.duration) return 0;
    const lower = s.duration.toLowerCase();
    if (lower.includes("hour")) {
      const hours = parseInt(lower);
      return hours * 60;
    }
    return parseInt(lower);
  };

  // Check if a slot is valid for the selected service
  const isSlotAvailable = (index: number) => {
    if (!service) return true;
    const serviceDuration = getServiceDurationMinutes(service);
    if (!serviceDuration) return true;

    const slotDuration = businessInfo?.slot_duration || 30;
    const slotsNeeded = Math.ceil(serviceDuration / slotDuration);

    for (let i = 0; i < slotsNeeded; i++) {
      const slot = availableSlots[index + i];
      if (!slot || slot.booked || slot.past) return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !date || !time || !employeeId) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const customerId = localStorage.getItem("customerId");
    const bookingPayload = {
      business_id: businessId,
      employee_id: employeeId,   // include staff
      service_id: service,
      customer_id: customerId,
      booking_date: format(date, "yyyy-MM-dd"),
      booking_time: time,
      notes,
    };

    if (!customerId) {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));
      toast({ title: "Please log in to complete your booking" });
      navigate("/customer/login");
      return;
    }

    try {
      await axios.post("https://slotly-backend-92ig.onrender.com/api/bookings/create", bookingPayload);
      toast({
        title: "Booking created!",
        description: `Your ${service} is confirmed for ${format(date, "PPP")} at ${time}.`,
      });
      setService(""); setEmployeeId(""); setDate(undefined); setTime(""); setNotes("");
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
              {filteredServices.map((s: any, idx: number) => (
                <SelectItem key={idx} value={s.name}>
                  {s.name} — ₹{s.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

         {/* Employee */}
        <div className="space-y-2">
          <Label>Staff *</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger><SelectValue placeholder="Select a staff member" /></SelectTrigger>
            <SelectContent>
              {filteredEmployees.map((emp: any) => (
                <SelectItem key={emp._id} value={emp._id}>
                  {emp.name} {/* only show name */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
