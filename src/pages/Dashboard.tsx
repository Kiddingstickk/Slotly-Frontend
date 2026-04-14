import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Scissors, ImageIcon, MapPin, Phone, ExternalLink, IndianRupee, Clock } from "lucide-react";
import BusinessRegistrationForm from "./BusinessRegisterPage";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  confirmed: "default",
  pending: "secondary",
  completed: "outline",
};

const Dashboard = ({ userId }: { userId: string }) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`https://slotly-backend-92ig.onrender.com/api/businesses/user/${userId}`);
        const businessList = res.data.businesses || [];
        setBusinesses(businessList);

        if (businessList.length > 0) {
          const businessId = businessList[0]._id;
          const bookingRes = await axios.get(`https://slotly-backend-92ig.onrender.com/api/bookings/business/${businessId}`);
          const allBookings = bookingRes.data.bookings || bookingRes.data || [];

          // Filter only today's bookings
          const today = new Date().toDateString();
          const todaysBookings = allBookings.filter(
            (b: any) => new Date(b.booking_date).toDateString() === today
          );
          setBookings(todaysBookings);
        }
      } catch (err) {
        console.error("Error fetching business/bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [userId]);

  const toggleExpand = (id: string) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  if (loading) return <p>Loading...</p>;
  if (businesses.length === 0) return <BusinessRegistrationForm />;

  const business = businesses[0];

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: CalendarDays },
    { label: "Services", value: business.services?.length || 0, icon: Scissors },
    { label: "Gallery Photos", value: business.images?.length || 0, icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <h1 className="text-lg font-bold tracking-tight text-foreground">{business.name}</h1>
          <Button asChild variant="ghost" size="sm">
            <Link to={`/${business._id}`}>
              <ExternalLink className="mr-1.5 h-4 w-4" /> View Page
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex flex-col items-center gap-1 p-4">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Info + Services */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Business Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Business Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4">
                {business.logo && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <img src={business.logo} alt="Logo" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{business.name}</p>
                  <p className="text-sm text-muted-foreground">{business.bio}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-foreground">
                <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{business.address}</span>
                <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{business.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {business.services?.map((s: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between rounded-md border p-3">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Clock className="h-3.5 w-3.5" />{s.duration}</span>
                      <span className="flex items-center gap-0.5 font-semibold text-foreground"><IndianRupee className="h-3.5 w-3.5" />{s.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {b.customerName || b.customer_id?.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <a href={`tel:${b.customer_id?.phone}`} className="text-blue-600 underline">
                        {b.customer_id?.phone}
                      </a>
                    </TableCell>
                    <TableCell>{b.serviceName || b.service_id}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(b.booking_date).toLocaleDateString()}</TableCell>
                    <TableCell>{b.booking_time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[b.status] || "default"}
                        className="capitalize text-xs cursor-pointer"
                        onClick={() => toggleExpand(b._id)}
                      >
                        {b.status}
                      </Badge>
                      {expandedBookingId === b._id && (
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="default">Confirm</Button>
                          <Button size="sm" variant="secondary">Reschedule</Button>
                          <Button size="sm" variant="destructive">Cancel</Button>
                          <Button size="sm" variant="outline">Complete</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {business.images?.map((url: string, idx: number) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={url}
                    alt={`Business ${idx}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;