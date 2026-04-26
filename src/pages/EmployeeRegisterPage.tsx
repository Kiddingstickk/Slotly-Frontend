import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  name: string;
  role: string;
  phone: string;
  services: string[];
}

const EmployeeRegistrationPage = () => {
  const { toast } = useToast();
  const { businessId } = useParams();
  const navigate = useNavigate();

  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    role: "",
    phone: "",
    services: [],
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/businesses/${businessId}`
        );
        setBusinessInfo(res.data);
      } catch (err) {
        console.error("Error fetching business:", err);
      }
    };
    if (businessId) fetchBusiness();
  }, [businessId]);

  const handleChange = (field: keyof Employee, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setNewEmployee((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const addEmployee = () => {
    if (!newEmployee.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setEmployees([...employees, newEmployee]);
    setNewEmployee({ name: "", role: "", phone: "", services: [] });
    toast({ title: "Employee added!" });
  };

  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      for (const emp of employees) {
        await axios.post(
          "https://slotly-backend-92ig.onrender.com/api/employees/create",
          {
            business_id: businessId,
            name: emp.name,
            role: emp.role,
            phone: emp.phone,
            services: emp.services,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      toast({ title: "Employees saved successfully!" });
      // ✅ Redirect to availability setup
      navigate(`/availability/${businessId}`);
    } catch (err: any) {
      console.error("Error saving employees:", err);
      toast({ title: "Error saving employees", variant: "destructive" });
    }
  };

  if (!businessInfo) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Register Employees</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Add your staff members and assign services they can perform.
      </p>

      {/* New Employee Form */}
      <div className="space-y-3 rounded-xl border bg-card p-5 mb-6">
        <div>
          <Label>Name</Label>
          <Input
            value={newEmployee.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Employee name"
          />
        </div>
        <div>
          <Label>Role</Label>
          <Input
            value={newEmployee.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Stylist, Therapist, etc."
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={newEmployee.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Contact number"
          />
        </div>

        {/* Services Multi-select */}
        <div>
          <Label>Assign Services</Label>
          <div className="space-y-2">
            {businessInfo.services?.map((service: any) => (
              <div key={service.name} className="flex items-center space-x-2">
                <Checkbox
                  checked={newEmployee.services.includes(service.name)}
                  onCheckedChange={() => toggleService(service.name)}
                />
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addEmployee} className="w-full">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Employee List Preview */}
      <div className="space-y-3 mb-6">
        {employees.map((emp, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border p-3 bg-card"
          >
            <div>
              <p className="font-semibold">{emp.name}</p>
              <p className="text-sm text-muted-foreground">
                {emp.role || "No role"} • {emp.phone || "No phone"}
              </p>
              <p className="text-xs text-muted-foreground">
                Services: {emp.services.join(", ") || "None"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeEmployee(idx)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={handleSave} size="lg" className="w-full text-base">
        Save Employees
      </Button>
    </div>
  );
};

export default EmployeeRegistrationPage;
