import ServiceItem from "./ServiceItem";
import { Phone, MessageCircle, Send, Facebook, Instagram, Twitter } from "lucide-react";

// Import background images
import verificationModel from "@/assets/verification-model.png";
import flightTicket from "@/assets/flight-ticket.png";
import usaFlag from "@/assets/usa-flag.png";
import ukFlag from "@/assets/uk-flag.png";
import canadaFlag from "@/assets/canada-flag.png";

const services = [
  "Paper Holding",
  "Military ID Card",
  "Video Lips Sync",
  "Frame Holding",
  "Flash Mail",
  "News Broadcast",
  "Hospital Bill Invoice",
  "Hotel Bookings",
  "Picture to Video",
  "Tracking Link",
  "All Cities Driver License",
  "Picture Undressing",
  "Inside Jail Editing",
  "All Selfie Verifications",
  "Flight Ticket Editing",
  "Trackable Flight Booking",
  "Num Verification (Any App)",
  "Social Media Boosting",
  "Video Calling (Per Min)",
  "Photo Editing",
  "Facebook Available",
  "TikTok Available",
];

const Flyer = () => {
  return (
    <div className="w-full h-screen max-w-md mx-auto bg-gradient-bg relative overflow-hidden flex flex-col">
      {/* Scattered Background Images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Verification Model - top left */}
        <img 
          src={verificationModel} 
          alt="" 
          className="absolute -top-4 -left-8 w-28 h-28 object-cover rounded-full opacity-25 rotate-[-15deg] border-2 border-neon-pink/30"
        />
        
        {/* Flight Ticket - top right */}
        <img 
          src={flightTicket} 
          alt="" 
          className="absolute top-8 -right-6 w-24 h-20 object-cover opacity-30 rotate-[20deg]"
        />
        
        {/* USA Flag - mid left */}
        <img 
          src={usaFlag} 
          alt="" 
          className="absolute top-[35%] -left-4 w-16 h-12 object-cover opacity-35 rotate-[-10deg]"
        />
        
        {/* UK Flag - mid right */}
        <img 
          src={ukFlag} 
          alt="" 
          className="absolute top-[25%] -right-2 w-14 h-10 object-cover opacity-35 rotate-[15deg]"
        />
        
        {/* Canada Flag - bottom left */}
        <img 
          src={canadaFlag} 
          alt="" 
          className="absolute bottom-[30%] -left-2 w-14 h-12 object-cover opacity-30 rotate-[8deg]"
        />
        
        {/* Another verification - bottom right */}
        <img 
          src={verificationModel} 
          alt="" 
          className="absolute bottom-[18%] -right-6 w-24 h-24 object-cover rounded-full opacity-20 rotate-[10deg] border-2 border-neon-blue/30"
        />
        
        {/* Flight ticket - bottom */}
        <img 
          src={flightTicket} 
          alt="" 
          className="absolute bottom-4 left-4 w-20 h-16 object-cover opacity-25 rotate-[-20deg]"
        />

        {/* Country Code Badges */}
        <div className="absolute top-[45%] right-2 bg-neon-blue/30 px-2 py-1 rounded text-[10px] font-bold text-foreground opacity-50 rotate-[5deg]">
          +1
        </div>
        <div className="absolute top-[55%] left-2 bg-neon-pink/30 px-2 py-1 rounded text-[10px] font-bold text-foreground opacity-50 rotate-[-8deg]">
          +44
        </div>
        <div className="absolute bottom-[40%] right-6 bg-neon-orange/30 px-2 py-1 rounded text-[10px] font-bold text-foreground opacity-40 rotate-[12deg]">
          +1
        </div>

        {/* Social Media Icons Scattered */}
        <div className="absolute top-16 left-8 opacity-30">
          <Facebook className="w-6 h-6 text-neon-blue" />
        </div>
        <div className="absolute top-[40%] right-8 opacity-25">
          <Instagram className="w-5 h-5 text-neon-pink" />
        </div>
        <div className="absolute bottom-[50%] left-6 opacity-30">
          <Twitter className="w-5 h-5 text-neon-blue" />
        </div>
        <div className="absolute bottom-28 right-4 opacity-25">
          <Phone className="w-5 h-5 text-neon-green" />
        </div>
        <div className="absolute top-[60%] left-1 opacity-20">
          <MessageCircle className="w-4 h-4 text-neon-green" />
        </div>
      </div>

      {/* Decorative blur elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-neon-pink/20 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-36 h-36 bg-neon-orange/15 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative z-10 pt-6 pb-4 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black uppercase tracking-wider bg-gradient-to-r from-neon-pink via-neon-orange to-neon-blue bg-clip-text text-transparent drop-shadow-lg">
            Premium Services
          </h1>
          <div className="mt-1 h-1 w-32 mx-auto bg-gradient-to-r from-neon-pink to-neon-blue rounded-full" />
        </div>
      </div>

      {/* Services Section */}
      <div className="relative z-10 flex-1 px-4 py-2">
        <div className="bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-neon-pink/30 shadow-lg shadow-neon-pink/10">
          <div className="text-center mb-3">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-neon-pink to-neon-orange rounded-full text-xs font-bold uppercase tracking-widest text-foreground shadow-lg">
              Our Services
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {services.map((service, index) => (
              <ServiceItem key={index} text={service} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative z-10 px-4 pb-6 pt-2">
        <div className="bg-gradient-to-r from-neon-pink/20 via-neon-blue/20 to-neon-orange/20 rounded-2xl p-4 border border-neon-blue/30 backdrop-blur-sm">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-neon-blue mb-3">
            Contact Us Now
          </p>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg shadow-neon-green/30">
                <Phone className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-[9px] text-muted-foreground uppercase">Call</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-lg shadow-neon-green/30">
                <MessageCircle className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-[9px] text-muted-foreground uppercase">WhatsApp</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center shadow-lg shadow-neon-blue/30">
                <Send className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-[9px] text-muted-foreground uppercase">Telegram</span>
            </div>
          </div>
        </div>
        
        {/* Footer branding */}
        <p className="text-center mt-3 text-[10px] text-muted-foreground uppercase tracking-widest">
          Fast • Reliable • Discrete
        </p>
      </div>
    </div>
  );
};

export default Flyer;
