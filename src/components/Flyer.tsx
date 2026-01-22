import ServiceItem from "./ServiceItem";
import { Phone, MessageCircle, Send } from "lucide-react";

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
      {/* Decorative background elements */}
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
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-neon-pink/30 shadow-lg shadow-neon-pink/10">
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
