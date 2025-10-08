import {
  CheckCircle,
  Sparkles,
  Shield,
  Heart,
  AlertCircle,
  Users,
  Video,
  CreditCard,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// Services data
export const dentalServices = [
  {
    icon: CheckCircle,
    title: "General Checkup",
    desc: "Professional general checkup services with the latest technology",
    price: "$99",
  },
  {
    icon: Sparkles,
    title: "Teeth Cleaning",
    desc: "Professional teeth cleaning services with the latest technology",
    price: "$129",
  },
  {
    icon: Shield,
    title: "Dental Filling",
    desc: "Professional dental filling services with the latest technology",
    price: "$199",
  },
  {
    icon: Heart,
    title: "Tooth Extraction",
    desc: "Professional tooth extraction services with the latest technology",
    price: "$299",
  },
  {
    icon: AlertCircle,
    title: "Emergency Care",
    desc: "Professional emergency care services with the latest technology",
    price: "$149",
  },
  {
    icon: Users,
    title: "Consultation",
    desc: "Professional consultation services with the latest technology",
    price: "$49",
  },
];

// About features data
export const features = [
  {
    icon: Video,
    title: "Virtual Consultations",
    description: "Schedule a video consultation from the comfort of your home",
    color: "blue",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options and financing plans available",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Safe & Sterile",
    description: "State-of-the-art sterilization and safety protocols",
    color: "green",
  },
];

// Stats data
export const stats = [
  { value: "10K+", label: "Happy Patients" },
  { value: "15+", label: "Years Experience" },
  { value: "4.9", label: "Rating" },
  { value: "100%", label: "Safe Care" },
];

// CTA benefits
export const ctaBenefits = [
  "Same-day appointments available",
  "Insurance accepted",
  "Flexible payment plans",
  "Modern, comfortable facilities",
  "Experienced dental team",
  "Latest dental technology",
];

// Contact info
export const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "(555) 123-4567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@brightsmile.dental",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Dental Street, Healthcare City",
  },
];

// Team members
export const teamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Williams",
    role: "Chief Dentist",
    specialty: "General Dentistry",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    role: "Orthodontist",
    specialty: "Orthodontics",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    role: "Dental Surgeon",
    specialty: "Oral Surgery",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    role: "Periodontist",
    specialty: "Gum Care",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop",
  },
];

// Gallery images
export const galleryImages = [
  {
    id: 1,
    title: "Modern Reception Area",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Treatment Room",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Waiting Lounge",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Advanced Equipment",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Consultation Room",
    image:
      "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Sterilization Area",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&auto=format&fit=crop",
  },
];

// Testimonials
export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    content:
      "Best dental experience I've ever had! The team is professional, caring, and made me feel completely at ease.",
    rating: 5,
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content:
      "The technology they use is cutting-edge. My teeth cleaning was painless and thorough. Highly recommend!",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Teacher",
    content:
      "Finally found a dentist I trust! They explain everything clearly and genuinely care about my dental health.",
    rating: 5,
    initials: "ER",
  },
];

// FAQs
export const faqs = [
  {
    question: "Do you accept insurance?",
    answer:
      "Yes, we accept most major dental insurance plans. Contact us to verify your coverage.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer:
      "Please bring your insurance card, photo ID, and a list of any medications you're currently taking.",
  },
  {
    question: "Do you offer emergency services?",
    answer:
      "Yes, we provide same-day emergency appointments for urgent dental issues.",
  },
  {
    question: "How often should I visit the dentist?",
    answer:
      "We recommend a dental checkup and cleaning every six months for optimal oral health.",
  },
];

// Booking services (for dropdown)
export const bookingServices = [
  "General Checkup",
  "Teeth Cleaning",
  "Dental Filling",
  "Tooth Extraction",
  "Emergency Care",
  "Consultation",
];