import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { format, startOfDay } from "date-fns";
import { ArrowLeft, Check, CalendarDays, Clock, User, Scissors, NotebookPen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem , AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";

const BookingPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();

  // State
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [service, setService] = useState<string>(""); // store service name directly
  const [employeeId, setEmployeeId] = useState<string>(""); 
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [openItem, setOpenItem] = useState<string>("service");

  // Look up the full service object by name
  const selectedService = businessInfo?.services.find((s: any) => s.name === service);


  // Fetch business + employees
  useEffect(() => {
    const fetchData = async () => {
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
    if (businessId) fetchData();
  }, [businessId]);

  // Fetch availability when date or employee changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date || !businessId || !employeeId || employeeId === "any") return;
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

  // Filtering logic
  const filteredEmployees = service
    ? employees.filter((emp: any) => emp.services.includes(service))
    : employees;

  const filteredServices = employeeId && employeeId !== "any"
    ? businessInfo?.services.filter((srv: any) => {
        const emp = employees.find((e: any) => e._id === employeeId);
        return emp?.services.includes(srv.name);
      })
    : businessInfo?.services || [];

  const staff = employees.find((e: any) => e._id === employeeId);
  const canConfirm = !!service && !!date && !!time && employeeId;

  // Handle booking
  const handleConfirm = async () => {
    if (!canConfirm) return;
    const customerId = localStorage.getItem("customerId");

    // If "any" chair, pick first eligible staff
    let chosenEmployee = employeeId;
    if (employeeId === "any") {
      const eligible = employees.filter((emp: any) => emp.services.includes(service));
      if (eligible.length === 0) {
        toast.error("No staff available for this service");
        return;
      }
      chosenEmployee = eligible[0]._id;
    }

    const bookingPayload = {
      business_id: businessId,
      employee_id: chosenEmployee,
      service_id: service, // send service name
      customer_id: customerId,
      booking_date: format(date!, "yyyy-MM-dd"),
      booking_time: time,
      notes,
    };

    if (!customerId) {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));
      toast.error("Please log in to complete your booking");
      navigate("/customer/login");
      return;
    }

    try {
      await axios.post("https://slotly-backend-92ig.onrender.com/api/bookings/create", bookingPayload);
      toast.success("Booking created!", {
        description: `${service} with ${employeeId === "any" ? "Any available staff" : staff?.name} on ${format(date!, "PPP")} at ${time}.`,
      });
      setService(""); setEmployeeId(""); setDate(undefined); setTime(null); setNotes("");
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error("Booking failed. Please try again.");
    }
  };

  if (!businessInfo) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-cream/40 font-body text-foreground">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link
            to={`/${businessInfo._id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {businessInfo.name}
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Powered by Slotly
          </span>
        </div>
      </header>
  
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-10">
          Book an appointment
        </h1>
  
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
          {/* Form */}
          <div className="bg-background rounded-2xl border border-border overflow-hidden">
            <Accordion
              type="single"
              collapsible
              value={openItem}
              onValueChange={(v) => setOpenItem(v)}
              className="divide-y divide-border"
            >
              {/* SERVICE */}
              <AccordionItem value="service" className="border-0">
                <SectionHeader
                  icon={<Scissors className="w-4 h-4" />}
                  step={1}
                  label="Service"
                  summary={service ? `${service} selected` : "Choose a service"}
                  done={!!service}
                />
                <AccordionContent className="px-5 sm:px-6 pb-5">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {(employeeId && employeeId !== "any" ? filteredServices : businessInfo.services).map((s: any) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => { setService(s.name); setOpenItem("staff"); }}
                        className={cn(
                          "text-left rounded-xl border p-4 transition-colors",
                          service === s.name
                            ? "border-olive bg-olive/5 ring-1 ring-olive"
                            : "border-border hover:border-foreground/30 hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-display text-base text-foreground">{s.name}</div>
                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                              {s.duration} min
                            </div>
                          </div>
                          <div className="font-display text-lg text-olive-deep">₹{s.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
  
              {/* STAFF */}
              <AccordionItem value="staff" className="border-0">
                <SectionHeader
                  icon={<User className="w-4 h-4" />}
                  step={2}
                  label="Staff"
                  summary={employeeId ? (employeeId === "any" ? "Any available" : staff?.name) : "Choose a staff member"}
                  done={!!employeeId}
                />
                <AccordionContent className="px-5 sm:px-6 pb-5">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {/* Any available option 
                    <button
                      type="button"
                      onClick={() => { setEmployeeId("any"); setOpenItem("date"); }}
                      className={cn(
                        "text-left rounded-xl border p-4 transition-colors flex items-center gap-3",
                        employeeId === "any"
                          ? "border-olive bg-olive/5 ring-1 ring-olive"
                          : "border-border hover:border-foreground/30 hover:bg-muted/40"
                      )}
                    >
                      <div className="w-9 h-9 rounded-full bg-cream-deep flex items-center justify-center font-mono text-xs font-semibold text-olive-deep">★</div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Any available</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                          First open chair
                        </div>
                      </div>
                    </button>*/}
  
                    {(service ? filteredEmployees : employees).map((emp: any) => (
                      <button
                        key={emp._id}
                        type="button"
                        onClick={() => { setEmployeeId(emp._id); setOpenItem("date"); }}
                        className={cn(
                          "text-left rounded-xl border p-4 transition-colors flex items-center gap-3",
                          employeeId === emp._id
                            ? "border-olive bg-olive/5 ring-1 ring-olive"
                            : "border-border hover:border-foreground/30 hover:bg-muted/40"
                        )}
                      >
                        <div className="w-9 h-9 rounded-full bg-cream-deep flex items-center justify-center font-mono text-xs font-semibold text-olive-deep">
                          {emp.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{emp.name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                            {emp.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
  
              {/* DATE */}
              <AccordionItem value="date" className="border-0">
                <SectionHeader
                  icon={<CalendarDays className="w-4 h-4" />}
                  step={3}
                  label="Date"
                  summary={date ? format(date, "EEE, MMM d") : "Pick a date"}
                  done={!!date}
                />
                <AccordionContent className="px-5 sm:px-6 pb-5">
                  <div className="flex justify-center sm:justify-start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => { setDate(d); if (d) setOpenItem("time"); }}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      className={cn("p-3 pointer-events-auto rounded-lg border border-border")}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
  
              {/* TIME */}
              <AccordionItem value="time" className="border-0">
                <SectionHeader
                  icon={<Clock className="w-4 h-4" />}
                  step={4}
                  label="Time"
                  summary={time ?? "Pick a time"}
                  done={!!time}
                />
                <AccordionContent className="px-5 sm:px-6 pb-5">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slotObj: any, idx: number) => {
                        const disabled = slotObj.booked || slotObj.past;
                        const active = time === slotObj.time;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => { if (!disabled) { setTime(slotObj.time); setOpenItem("notes"); } }}
                            disabled={disabled}
                            className={cn(
                              "h-10 rounded-lg font-mono text-xs tracking-wider border transition-colors",
                              active
                                ? "bg-olive text-cream border-olive"
                                : disabled
                                  ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                                  : "bg-background text-foreground border-border hover:border-foreground/40"
                            )}
                          >
                            {slotObj.time}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-6 text-center text-sm text-muted-foreground">No slots available</div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
                          {/* NOTES */}
            <AccordionItem value="notes" className="border-0">
              <SectionHeader
                icon={<NotebookPen className="w-4 h-4" />}
                step={5}
                label="Notes"
                summary={notes ? `${notes.slice(0, 40)}${notes.length > 40 ? "…" : ""}` : "Optional"}
                done={notes.length > 0}
              />
              <AccordionContent className="px-5 sm:px-6 pb-5">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything we should know? Allergies, references, preferred shampoo…"
                  className="min-h-[110px] bg-background"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-6">
          <div className="bg-background rounded-2xl border border-border p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Your booking
            </div>
            <h3 className="font-display text-2xl text-foreground tracking-tight mt-1">
              Summary
            </h3>

            <dl className="mt-6 space-y-3 text-sm">
              <SummaryRow label="Service" value={service || "—"} />
              <SummaryRow label="Staff" value={staff?.name ?? "Any available"} />
              <SummaryRow
                label="When"
                value={date && time ? `${format(date, "MMM d")} · ${time}` : "—"}
              />
              <SummaryRow
                label="Duration"
                value={selectedService ? `${selectedService.duration} min` : "—"}
              />
            </dl>

            <div className="mt-6 pt-5 border-t border-border flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="font-display text-3xl text-olive-deep">
                ₹{selectedService?.price ?? 0}
              </span>
            </div>


            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="w-full mt-6 h-11 bg-olive hover:bg-olive-deep text-cream"
            >
              Confirm booking
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              You won't be charged until your appointment.
            </p>
          </div>
        </aside>
      </div>
    </main>
  </div>
);

};

const SectionHeader = ({ icon, step, label, summary, done }: { icon: React.ReactNode; step: number; label: string; summary: string; done: boolean }) => (
  <AccordionTrigger className="px-5 sm:px-6 py-4 hover:no-underline group">
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors", done ? "bg-olive text-cream" : "bg-cream-deep text-olive-deep")}>
        {done ? <Check className="w-4 h-4" /> : <span className="font-mono text-xs">{step}</span>}
      </div>
      <div className="text-left min-w-0 flex-1">
        <div className="flex items-center gap-2 text-foreground">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-display text-base">{label}</span>
        </div>
        <div className="text-xs text-muted-foreground truncate mt-0.5">{summary}</div>
      </div>
    </div>
  </AccordionTrigger>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
    <dd className="text-right text-foreground truncate">{value}</dd>
  </div>
);

export default BookingPage;
