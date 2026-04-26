import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import axios from "axios";

interface ServiceEntry {
  name: string;
  price: number;
  duration: string;
  description: string;
}

const BusinessRegistrationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [services, setServices] = useState<ServiceEntry[]>([
    { name: "", price: 0, duration: "", description: "" },
  ]);

  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          axios.get("https://slotly-backend-92ig.onrender.com/api/categories"),
          axios.get("https://slotly-backend-92ig.onrender.com/api/cities"),
        ]);
        setCategories(catRes.data || []);
        setCities(cityRes.data || []);
      } catch (err) {
        console.error("Error fetching categories/cities:", err);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover" | "gallery"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "logo" || type === "cover") {
      const file = files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      if (type === "logo") {
        setLogo(file);
        setLogoPreview(url);
      } else {
        setCoverImage(file);
        setCoverPreview(url);
      }
    } else {
      const newFiles = Array.from(files).slice(0, 6 - galleryFiles.length);
      if (newFiles.length === 0) {
        toast({ title: "Maximum 6 gallery images allowed", variant: "destructive" });
        return;
      }
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
      setGalleryFiles((prev) => [...prev, ...newFiles]);
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addService = () => {
    setServices((prev) => [...prev, { name: "", price: 0, duration: "", description: "" }]);
  };

  const removeService = (index: number) => {
    if (services.length <= 1) return;
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof ServiceEntry, value: string | number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const uploadToImageKit = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post("https://slotly-backend-92ig.onrender.com/api/test", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let logoUrl = "";
      if (logo) logoUrl = await uploadToImageKit(logo);
      let coverUrl = "";
      if (coverImage) coverUrl = await uploadToImageKit(coverImage);

      const imageUrls: string[] = [];
      for (const img of galleryFiles) {
        const url = await uploadToImageKit(img);
        imageUrls.push(url);
      }

      const payload = {
        name: businessName.trim(),
        category_id: category,
        bio: bio.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        instagram_url: instagram.trim(),
        address: address.trim(),
        city_id: city,
        logo: logoUrl,
        heroImage: coverUrl,
        images: imageUrls,
        services,
      };

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://slotly-backend-92ig.onrender.com/api/businesses/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

    const createdBusiness = res.data.business || res.data; // adjust based on your backend response

    toast({ title: "Business registered successfully!" });

    // ✅ Redirect to availability setup with businessId
    navigate(`/employees/${createdBusiness._id}`);
  } catch (err) {
    console.error("Registration failed:", err);
    toast({ title: "Error registering business", variant: "destructive" });
  }
};


  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <span className="font-bold text-foreground">Register Your Business</span>
        </div>
      </div>
           <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5 px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">Register Your Business</h1>

        {/* Business Name */}
        <div className="space-y-2">
          <Label>Business Name *</Label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
            maxLength={100}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your business..."
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>Phone *</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            type="tel"
            maxLength={15}
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Enter WhatsApp number"
            type="tel"
            maxLength={15}
          />
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <Label>Instagram URL</Label>
          <Input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/yourbusiness"
            type="url"
            maxLength={255}
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter business address"
            maxLength={255}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>City *</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo Upload</Label>
          <div className="flex items-center gap-3">
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/50 transition-colors hover:bg-muted">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "logo")}
              />
            </label>
            {logo && <span className="text-sm text-muted-foreground">{logo.name}</span>}
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/50 transition-colors hover:bg-muted overflow-hidden">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload cover image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "cover")}
            />
          </label>
        </div>

        {/* Gallery Images */}
        <div className="space-y-2">
          <Label>Gallery Images (max 6)</Label>
          <div className="grid grid-cols-3 gap-2">
            {galleryPreviews.map((preview, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
                <img src={preview} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {galleryFiles.length < 6 && (
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/50 transition-colors hover:bg-muted">
                <Plus className="h-5 w-5 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "gallery")}
                />
              </label>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <Label>Services</Label>
          {services.map((svc, index) => (
            <div key={index} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Service {index + 1}</span>
                {services.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="h-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
              <Input
                placeholder="Service Name"
                value={svc.name}
                onChange={(e) => updateService(index, "name", e.target.value)}
                maxLength={100}
              />
              <Input
                placeholder="Price"
                type="number"
                value={svc.price}
                onChange={(e) => updateService(index, "price", Number(e.target.value))}
              />
              <Input
                placeholder="Duration (e.g. 30 mins)"
                value={svc.duration}
                onChange={(e) => updateService(index, "duration", e.target.value)}
                maxLength={50}
              />
              <Input
                placeholder="Description"
                value={svc.description}
                onChange={(e) => updateService(index, "description", e.target.value)}
                maxLength={255}
              />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addService} className="w-full">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Service
          </Button>
        </div>

        <Button type="submit" size="lg" className="w-full text-base">
          Register Business
        </Button>
      </form>
    </div>
  );
};

export default BusinessRegistrationForm;